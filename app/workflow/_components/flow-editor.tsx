"use client"

import React from "react"

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useNodesState,
  useEdgesState,
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
  const [nodes, setNodes, onNodesChange] = useNodesState([
    createFlowNode(TaskType.LAUNCH_BROWSER, { x: 0, y: 0 }),
  ])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

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
        fitView={true} // Center the view on load
        fitViewOptions={fitViewOptions}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={10} size={0.75} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor
