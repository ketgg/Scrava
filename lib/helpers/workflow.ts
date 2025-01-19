import { Edge } from "@xyflow/react"

import { AppNode, AppNodeInvalidInputs } from "@/types/app-node"
import { TaskType } from "@/types/task"
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from "@/types/workflow"

import { TaskRegistry } from "@/configs/workflow/task-registry"

export const createFlowNode = (
  taskType: TaskType,
  position: { x: number; y: number }
): AppNode => {
  return {
    id: crypto.randomUUID(),
    type: "ScrapeNode",
    dragHandle: ".drag-handle", // Custom class to allow dragging the node
    data: {
      type: taskType,
      inputs: {},
    },
    position: position ?? { x: 0, y: 0 },
  }
}

export enum FlowToExecutionPlanValidationError {
  "NO_ENTRY_POINT",
  "INVALID_INPUTS",
}

type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan
  error?: {
    type: FlowToExecutionPlanValidationError
    nodesWithInvalidInputs?: AppNodeInvalidInputs[]
  }
}
export const flowToExecutionPlan = (
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanType => {
  // Search for entry point
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  )
  if (!entryPoint) {
    return { error: { type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT } }
  }

  const nodesWithInvalidInputs : AppNodeInvalidInputs[] = []
  const planned = new Set<string>()

  // Check if entryPoint has invalid inputs
  const invalidInputs = getInvalidInputs(entryPoint, edges, planned)
  if(invalidInputs.length > 0) {
    nodesWithInvalidInputs.push({
      nodeId: entryPoint.id,
      invalidInputs,
    })
  }

  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ]
  planned.add(entryPoint.id)

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = {
      phase,
      nodes: []
    }

    for(const curNode of nodes) { 
      if(planned.has(curNode.id)) continue

      const invalidInputs = getInvalidInputs(curNode, edges, planned)
      if(invalidInputs.length > 0) {
        const incomers = getIncomers(curNode, nodes, edges)
        if(incomers.every(incomer => planned.has(incomer.id))) { 
          // If all incoming incomers/edges are planned
          // but the current node still has invalid inputs
          // then it means that the workflow is invalid
          nodesWithInvalidInputs.push({
            nodeId: curNode.id,
            invalidInputs,
          })
        } else {
          // Skip this curNode for now
          continue
        }
      }

      // Add curNode to the nextPhase
      nextPhase.nodes.push(curNode)
    }
    for(const node of nextPhase.nodes) planned.add(node.id)
    
    executionPlan.push(nextPhase)    
  }

  if(nodesWithInvalidInputs.length > 0) {
    return { 
      error: { 
        type: FlowToExecutionPlanValidationError.INVALID_INPUTS, 
        nodesWithInvalidInputs 
      } 
    }
  }
  return { executionPlan }
}

export const getInvalidInputs = (node: AppNode, edges: Edge[], planned: Set<string>) => {
  const invalidInputs = []
  const inputs = TaskRegistry[node.data.type].inputs

  for(const input of inputs) { 
    const inputValue = node.data.inputs[input.name]
    const isInputValueProvided = inputValue?.length > 0
    if(isInputValueProvided) continue // This input is fine

    // If the value is not provided by the user
    // We need to check if there is an incoming edge that is linked to this input
    const allIncomingEdges = edges.filter((edge) => edge.target === node.id)
    const incomingEdge = allIncomingEdges.find((edge) => edge.targetHandle === input.name)
    const isInputProvidedByIncomer = input.required && incomingEdge && planned.has(incomingEdge.source)
    if(isInputProvidedByIncomer) continue // This input is fine as its provided by an incomer that is already planned
    else if(!input.required) {
      // incomingEdge is not defined, that's fine
      if(!incomingEdge) continue
      // incomingEdge is defined, then we need to make sure that the incomer is planned
      if(incomingEdge && planned.has(incomingEdge.source)) continue
    }

    // If we reach here, then the input is invalid
    invalidInputs.push(input.name)
  }
  return invalidInputs
}

const getIncomers = (node: AppNode, nodes: AppNode[], edges: Edge[]) => {
  if(!node.id) return []
  const incomersIds = new Set()
  edges.forEach((edge) => {
    if(edge.target === node.id) incomersIds.add(edge.source)
  })
  return nodes.filter((node) => incomersIds.has(node.id))
}
