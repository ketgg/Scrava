import { AppNode } from "@/types/app-node"
import { TaskType } from "@/types/task"

export const createFlowNode = (
  nodeType: TaskType,
  position: { x: number; y: number }
): AppNode => {
  return {
    id: crypto.randomUUID(),
    type: "ScrapeNode",
    dragHandle: ".drag-handle", // Custom class to allow dragging the node
    data: {
      type: nodeType,
      inputs: {},
    },
    position: position ?? { x: 0, y: 0 },
  }
}
