import React from "react"

import { Handle, Position, useEdges } from "@xyflow/react"

import useFlowValidation from "@/hooks/use-flow-validation"

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

  const { nodesWithInvalidInputs } = useFlowValidation()
  const node = nodesWithInvalidInputs.find((node) => node.nodeId === nodeId)
  const isInvalidInput = node?.invalidInputs.includes(input.name)

  return (
    <div
      className={cn(
        "flex justify-start relative p-3 bg-secondary w-full",
        isInvalidInput && "bg-destructive/30"
      )}
    >
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
