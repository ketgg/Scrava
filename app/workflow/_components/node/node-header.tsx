import React from "react"
import { Coins, GripVertical } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { TaskType } from "@/types/task"
import { TaskRegistry } from "@/configs/workflow/task-registry"

type Props = {
  taskType: TaskType
}

const NodeHeader = ({ taskType }: Props) => {
  const task = TaskRegistry[taskType]
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
            TODO
          </Badge>
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
