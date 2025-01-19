import React from "react"

import { Handle, Position } from "@xyflow/react"

import { cn } from "@/lib/utils"

import { TaskParam } from "@/types/task"

import { HANDLE_BORDER, HANDLE_SIZE, HANDLE_COLORS } from "@/constants/handle"

type Props = {
  output: TaskParam
  nodeId: string
}

const NodeOutput = ({ output, nodeId }: Props) => {
  return (
    <div className="flex justify-end relative p-3 bg-secondary w-full">
      <p className="text-xs text-muted-foreground">{output.name}</p>
      <Handle
        id={output.name}
        type="source"
        position={Position.Right}
        className={cn(HANDLE_BORDER, HANDLE_SIZE, HANDLE_COLORS[output.type])}
      />
    </div>
  )
}

export default NodeOutput
