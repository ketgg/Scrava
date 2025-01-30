import "server-only"

import { revalidatePath } from "next/cache"
import { Browser, Page } from "puppeteer"
import { Edge } from "@xyflow/react"

import { prisma } from "@/lib/prisma"

import { ExecutionPhase, WorkflowExecution } from "@prisma/client"

import { TaskRegistry } from "@/configs/workflow/task-registry"
import { ExecutorRegistry } from "@/configs/execute/executor-registry"

import { AppNode } from "@/types/app-node"
import { Environment, ExecutionEnv } from "@/types/executor"
import { TaskParamType } from "@/types/task"
import {
  WorkflowExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow"
import { LogCollector } from "@/types/log"

import { createLogCollector } from "@/lib/helpers/log"
import { decrementUserBalance } from "./credits"

export const executeWorkflow = async (
  executionId: string,
  nextRunAt?: Date
) => {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: {
      workflow: true,
      phases: true,
    },
  })
  if (!execution) throw new Error("Execution not found")

  const edges = JSON.parse(execution.definition).edges as Edge[]

  // Setup execution environment
  const environment: Environment = { phases: {} }

  // Initialize workflow execution
  await initializeWorkflowExecution(
    executionId,
    execution.workflowId,
    nextRunAt
  )

  // Initialize phases
  await initializeWorkflowPhases(execution)

  let creditsConsumed = 0
  let executionFailed = false
  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(
      execution.userId,
      phase,
      environment,
      edges
    )
    creditsConsumed += phaseExecution.creditsConsumed
    if (!phaseExecution.success) {
      executionFailed = true
      break
    }
  }

  // Finalize workflow execution
  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    creditsConsumed,
    executionFailed
  )

  // Cleanup environment
  await cleanupEnvironment(environment)

  revalidatePath("/workflow/runs")
}

const initializeWorkflowExecution = async (
  executionId: string,
  workflowId: string,
  nextRunAt?: Date
) => {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  })

  await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      lastRunAt: new Date(),
      lastRunId: executionId,
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      ...(nextRunAt && { nextRunAt }),
    },
  })
}

const initializeWorkflowPhases = async (execution: any) => {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      },
    },
    data: {
      status: WorkflowExecutionPhaseStatus.PENDING,
    },
  })
}

const executeWorkflowPhase = async (
  userId: string,
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[]
) => {
  const logCollector = createLogCollector()
  const startedAt = new Date()
  const node = JSON.parse(phase.node) as AppNode

  setupEnvironmentForPhase(environment, node, edges)

  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      inputs: JSON.stringify(environment.phases[node.id].inputs),
      startedAt,
      status: WorkflowExecutionPhaseStatus.RUNNING,
    },
  })

  const creditsRequired = TaskRegistry[node.data.type].credits
  // Decrement user credits balance
  let success = await decrementUserBalance(
    userId,
    creditsRequired,
    logCollector
  )
  const creditsConsumed = success ? creditsRequired : 0
  if (success) {
    // Execute the phase
    success = await executePhase(environment, phase, node, logCollector)
  }

  const outputs = environment.phases[node.id].outputs

  await finalizePhase(phase.id, outputs, success, logCollector, creditsConsumed)

  return { success, creditsConsumed }
}

/**
 * Sets up the input and output for the phase
 * @param environment
 * @param node
 * @param edges
 */
const setupEnvironmentForPhase = (
  environment: Environment,
  node: AppNode,
  edges: Edge[]
) => {
  const nodeId = node.id
  environment.phases[nodeId] = {
    inputs: {},
    outputs: {},
  }
  const inputs = TaskRegistry[node.data.type].inputs
  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue

    const inputVal = node.data.inputs[input.name]
    if (inputVal) {
      environment.phases[nodeId].inputs[input.name] = inputVal
      continue
    }

    // If the input is not provided
    // We need to get it from the node whose output is connected to this input!
    const connectedEdge = edges.find(
      (edge) => edge.target === nodeId && edge.targetHandle === input.name
    )

    if (!connectedEdge) {
      // This should never happen, as we validate the workflow before execution
      console.error("Missing edge for input:", input.name, "Node ID:", nodeId)
      continue
    }

    const outputVal =
      environment.phases[connectedEdge.source].outputs[
        connectedEdge.sourceHandle!
      ]

    environment.phases[nodeId].inputs[input.name] = outputVal
  }
}

const executePhase = async (
  environment: Environment,
  phase: ExecutionPhase,
  node: AppNode,
  logCollector: LogCollector
): Promise<boolean> => {
  const execFn = ExecutorRegistry[node.data.type]
  if (!execFn) return false

  const executionEnv: ExecutionEnv<any> = createExecutionEnv(
    environment,
    node,
    logCollector
  )

  return await execFn(executionEnv) // Only pass the relevant environment required by the executor
}

const finalizePhase = async (
  phaseId: string,
  outputs: any,
  success: boolean,
  logCollector: LogCollector,
  creditsConsumed: number
) => {
  const finalStatus = success
    ? WorkflowExecutionPhaseStatus.COMPLETED
    : WorkflowExecutionPhaseStatus.FAILED

  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      execLogs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            timestamp: log.timestamp,
            logLevel: log.level,
          })),
        },
      },
    },
  })
}

const finalizeWorkflowExecution = async (
  executionId: string,
  workflowId: string,
  creditsConsumed: number,
  executionFailed: boolean
) => {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  })

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId, // This will ensure that only the last execution can update the status
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((error) => {
      // Ignore
      // This means that we have triggered multiple executions at the same time for this workflow
      // while the previous one is still running
    })
}

const createExecutionEnv = (
  environment: Environment,
  node: AppNode,
  logCollector: LogCollector
): ExecutionEnv<any> => {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) => {
      environment.phases[node.id].outputs[name] = value
    },
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => {
      environment.browser = browser
    },
    getPage: () => environment.page,
    setPage: (page: Page) => {
      environment.page = page
    },
    log: logCollector,
  }
}

const cleanupEnvironment = async (environment: Environment) => {
  if (environment.browser) {
    await environment.browser.close().catch((error) => {
      console.error("Error closing browser in cleanupEnvironment:", error)
    })
  }
}
