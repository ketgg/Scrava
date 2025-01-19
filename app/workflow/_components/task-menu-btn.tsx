"use client"

import React from "react"

import { Button } from "@/components/ui/button"

import { TaskType } from "@/types/task"
import { TaskRegistry } from "@/configs/workflow/task-registry"

type Props = {
  taskType: TaskType
}

const TaskMenuButton = ({ taskType }: Props) => {
  const task = TaskRegistry[taskType]

  const handleDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    taskType: TaskType
  ) => {
    event.dataTransfer.setData("application/reactflow", taskType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <Button
      variant="outline"
      size="default"
      draggable={true}
      onDragStart={(event) => handleDragStart(event, taskType)}
      className="flex items-center justify-between gap-2 w-full"
    >
      <div className="flex items-center gap-2 font-normal text-[0.825rem]">
        <task.icon />
        <span>{task.label}</span>
      </div>
    </Button>
  )
}

export default TaskMenuButton
