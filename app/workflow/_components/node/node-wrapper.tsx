import React, { memo } from "react"
import { NodeProps } from "@xyflow/react"

import NodeCard from "./node-card"
import NodeHeader from "./node-header"
import NodeInputs from "./node-inputs"
import NodeInput from "./node-input"
import NodeOutputs from "./node-outputs"
import NodeOutput from "./node-output"

import { AppNodeData } from "@/types/app-node"
import { TaskRegistry } from "@/configs/workflow/task-registry"

const NodeWrapper = memo(({ id, data, selected }: NodeProps) => {
  const nodeData = data as AppNodeData
  const task = TaskRegistry[nodeData.type]

  return (
    // isSelected={!!selected} Boolean conversion
    // as selected can be undefined
    <NodeCard nodeId={id} isSelected={!!selected}>
      <NodeHeader taskType={nodeData.type} nodeId={id} />
      <NodeInputs>
        {task.inputs.map((input) => (
          <NodeInput key={input.name} input={input} nodeId={id} />
        ))}
      </NodeInputs>
      <NodeOutputs>
        {task.outputs.map((output) => (
          <NodeOutput key={output.name} output={output} nodeId={id} />
        ))}
      </NodeOutputs>
    </NodeCard>
  )
})

export default NodeWrapper
NodeWrapper.displayName = "NodeWrapper"
