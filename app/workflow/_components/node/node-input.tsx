import React from "react"

import { Handle, Position, useEdges } from "@xyflow/react"

import NodeParamField from "./node-param-field"

import { cn } from "@/lib/utils"

import { TaskParam } from "@/types/task"

import { HANDLE_BORDER, HANDLE_SIZE, HANDLE_COLORS } from "@/constants/handle"

type Props = {
  input: TaskParam
  nodeId: string
}

const NodeInput = ({ input, nodeId }: Props) => {
  const edges = useEdges()
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  )

  return (
    <div className="flex justify-start relative p-3 bg-secondary w-full">
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          isConnectable={!isConnected}
          id={input.name}
          type="target"
          position={Position.Left}
          className={cn(HANDLE_BORDER, HANDLE_SIZE, HANDLE_COLORS[input.type])}
        />
      )}
    </div>
  )
}

export default NodeInput
