"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

import { Edge } from "@xyflow/react"

import {
  createWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/schema/workflow"

import {
  WorkflowStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionPhaseStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow"
import { AppNode } from "@/types/app-node"
import { TaskType } from "@/types/task"

import { createFlowNode, flowToExecutionPlan } from "@/lib/helpers/workflow"
import { TaskRegistry } from "@/configs/workflow/task-registry"

export const getUserWorkflows = async () => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthenticated")

    const workflows = await prisma.workflow.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return workflows
  } catch (error) {
    console.log("Error in getUserWorkflows:", error)
  }
}

export const createWorkflow = async (data: CreateWorkflowSchemaType) => {
  try {
    const { success, data: validatedData } =
      createWorkflowSchema.safeParse(data)
    if (!success) throw new Error("Invalid form data")

    const { userId } = await auth()
    if (!userId) throw new Error("Unauthenticated")

    const initialDef: { nodes: AppNode[]; edges: Edge[] } = {
      nodes: [],
      edges: [],
    }
    initialDef.nodes.push(
      createFlowNode(TaskType.LAUNCH_BROWSER, { x: 0, y: 0 })
    )

    const workflow = await prisma.workflow.create({
      data: {
        userId: userId,
        status: WorkflowStatus.DRAFT,
        definition: JSON.stringify(initialDef),
        ...validatedData,
      },
    })
    if (!workflow) throw new Error("Failed to create workflow")

    return workflow.id
  } catch (error) {
    console.log("Error in createWorkflow:", error)
  }
}

export const deleteWorkflow = async (workflowId: string) => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthenticated")

    await prisma.workflow.delete({
      where: { id: workflowId, userId: userId },
    })
    revalidatePath("/dashboard/workflows")
  } catch (error) {
    console.log("Error in deleteWorkflow:", error)
  }
}

export const updateWorkflow = async ({
  id,
  definition,
}: {
  id: string
  definition: string
}) => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthenticated")

    const workflow = await prisma.workflow.findUnique({
      where: { id: id, userId: userId },
    })
    if (!workflow) throw new Error("Workflow not found")
    if (workflow.status !== WorkflowStatus.DRAFT)
      throw new Error("Workflow is not in draft mode")

    await prisma.workflow.update({
      where: { id: id, userId: userId },
      data: {
        definition: definition,
      },
    })
    revalidatePath(`/dashboard/workflows`)
  } catch (error) {
    console.log("Error in saveWorkflow:", error)
  }
}

export const runWorkflow = async (data: {
  workflowId: string
  workflowDefinition?: string // Optional, because for published workflows, we will fetch the definition from the database
}) => {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthenticated")

  const { workflowId, workflowDefinition } = data
  if (!workflowId) throw new Error("Workflow ID is required")

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId, userId: userId },
  })
  if (!workflow) throw new Error("Workflow not found")

  let executionPlan: WorkflowExecutionPlan
  if (!workflowDefinition) throw new Error("Workflow definition not defined")

  const def = JSON.parse(workflowDefinition)
  const result = flowToExecutionPlan(def.nodes, def.edges)
  if (result.error) throw new Error("Invalid workflow definition")
  if (!result.executionPlan)
    throw new Error("Failed to generate execution plan")

  executionPlan = result.executionPlan
  // console.log("@@DEBUG - executionPlan", executionPlan)
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId: workflowId,
      userId: userId,
      status: WorkflowExecutionStatus.PENDING,
      trigger: WorkflowExecutionTrigger.MANUAL,
      startedAt: new Date(),
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId: userId,
              status: WorkflowExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            }
          })
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  })
  if (!execution) throw new Error("Failed to create workflow execution")

  return execution
}

/**
 * Get the workflow execution with phases
 * @param executionId - The execution ID
 * @returns The execution with phases
 */
export const getExecutionWithPhases = async (executionId: string) => {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthenticated")

  if (!executionId) throw new Error("Execution ID is required")

  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId, userId: userId },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  })
  // if (!execution) throw new Error("Execution not found") // Handled in the frontend

  return execution
}

export const getWorkflowPhaseDetails = async (phaseId: string) => {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthenticated")

  const phase = await prisma.executionPhase.findUnique({
    where: { id: phaseId, userId: userId },
  })
  if (!phase) throw new Error("Phase not found")

  return phase
}
