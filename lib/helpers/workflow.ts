import { AppNode } from "@/types/app-node"
import { TaskType } from "@/types/task"

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
