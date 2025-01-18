"use client"

import React, { useEffect } from "react"

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react"

import { Workflow } from "@prisma/client"

import "@xyflow/react/dist/style.css"

import { createFlowNode } from "@/lib/helpers/workflow"
import { TaskType } from "@/types/task"
import NodeWrapper from "./node/node-wrapper"

type Props = {
  workflow: Workflow
}

const nodeTypes = {
  ScrapeNode: NodeWrapper,
}

const snapGrid: [number, number] = [10, 10]
const fitViewOptions = { padding: 1 }

const FlowEditor = ({ workflow }: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { setViewport } = useReactFlow()
  useEffect(() => {
    try {
      const def = JSON.parse(workflow.definition)
      if (!def) return

      setNodes(def.nodes || [])
      setEdges(def.edges || [])

      if (!def.viewport) return
      const { x = 0, y = 0, zoom = 1 } = def.viewport
      setViewport({ x, y, zoom })
    } catch (error) {}
  }, [workflow.definition, setNodes, setEdges, setViewport])

  return (
    <main className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        fitView={true} // Center the view on load, Remove this to use saved viewport
        fitViewOptions={fitViewOptions}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={10} size={0.75} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor
