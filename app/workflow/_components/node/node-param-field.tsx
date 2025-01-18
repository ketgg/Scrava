"use client"

import React, { useCallback } from "react"
import { useReactFlow } from "@xyflow/react"

import StringParam from "./param/string-param"

import { TaskParam, TaskParamType } from "@/types/task"
import { AppNode } from "@/types/app-node"

type Props = {
  param: TaskParam
  nodeId: string
}

const NodeParamField = ({ param, nodeId }: Props) => {
  const { getNode, updateNodeData } = useReactFlow()

  /**
   * This is how node object looks like
   * {
   *  id: "126a7bf3-c44f-4666-af29-3053396b15bd"
   *  type: "ScrapeNode"
   *  data: {
   *    type: "LAUNCH_BROWSER"
   *    inputs: {
   *      "Website URL": ""
   *    }
   *  }
   *  dragHandle: ".drag-handle"
   *  position: { x: 0, y: 0 }
   *  measure: { width: 100, height: 100 }
   *  draggable: true
   *  selected: false
   * }
   */
  const node = getNode(nodeId) as AppNode
  // console.log("@Node", node)

  // On initial load, there is no [param.name] in the node.data.inputs.
  // So we need to set the value to an empty string as it will be undefined.
  // Also this prevents this error: A component is changing an uncontrolled input to be controlled.
  const value = node?.data.inputs?.[param.name] ?? ""
  // console.log("@Value", value)

  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data.inputs,
          [param.name]: newValue,
        },
      })
    },
    [nodeId, node?.data.inputs, param.name, updateNodeData]
  )
  switch (param.type) {
    case TaskParamType.STRING:
      return (
        <StringParam
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
        />
      )
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not implemented yet</p>
        </div>
      )
  }
}

export default NodeParamField
