import React from "react"

import { Handle, Position } from "@xyflow/react"

import NodeParamField from "./node-param-field"

import { cn } from "@/lib/utils"

import { TaskParam } from "@/types/task"

type Props = {
  input: TaskParam
  nodeId: string
}

const NodeInput = ({ input, nodeId }: Props) => {
  return (
    <div className="flex justify-start relative p-3 bg-secondary w-full">
      <NodeParamField param={input} nodeId={nodeId} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !w-4 !h-4"
          )}
        />
      )}
    </div>
  )
}

export default NodeInput
