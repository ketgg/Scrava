import { AppNode } from "@/types/app-node"

import { TaskRegistry } from "@/configs/workflow/task-registry"

export const calculateWorkflowCost = (nodes: AppNode[]) => {
  let creditsCost = 0
  for (const node of nodes) creditsCost += TaskRegistry[node.data.type].credits
  return creditsCost
}
