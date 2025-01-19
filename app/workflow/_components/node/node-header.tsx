import React from "react"
import { Coins, Copy, GripVertical, Trash2 } from "lucide-react"
import { useReactFlow } from "@xyflow/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { AppNode } from "@/types/app-node"
import { TaskType } from "@/types/task"

import { TaskRegistry } from "@/configs/workflow/task-registry"

import { createFlowNode } from "@/lib/helpers/workflow"

type Props = {
  taskType: TaskType
  nodeId: string
}

const NodeHeader = ({ taskType, nodeId }: Props) => {
  const task = TaskRegistry[taskType]
  const { deleteElements, getNode, addNodes } = useReactFlow()
  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={20} />
      <div className="flex items-center justify-between w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-1 items-center">
          {task.isEntryPoint && (
            <Badge className="rounded-full">Entry point</Badge>
          )}
          <Badge className="flex items-center gap-2 text-xs rounded-full">
            <Coins size={16} />
            {task.credits}
          </Badge>
          {!task.isEntryPoint && (
            <div className="flex gap-1 items-center ml-1">
              <Badge
                onClick={() =>
                  deleteElements({
                    nodes: [{ id: nodeId }],
                  })
                }
                variant="destructive"
                className="flex items-center text-xs rounded-full"
              >
                <Trash2 size={16} />
              </Badge>
              <Badge
                onClick={() => {
                  const node = getNode(nodeId) as AppNode
                  const newX = node.position.x
                  const newY = node.position.y + node.measured?.height! + 20
                  const newNode = createFlowNode(node.data.type, {
                    x: newX,
                    y: newY,
                  })
                  addNodes([newNode])
                }}
                variant="secondary"
                className="flex items-center text-xs rounded-full"
              >
                <Copy size={16} />
              </Badge>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            // drag-handle is a custom class to allow dragging the node
            className="drag-handle cursor-grab rounded-full"
          >
            <GripVertical size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NodeHeader
