"use client"

import React, { useCallback, useEffect } from "react"

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Connection,
  addEdge,
  Edge,
  getOutgoers,
} from "@xyflow/react"

import { Workflow } from "@prisma/client"

import "@xyflow/react/dist/style.css"

import NodeWrapper from "./node/node-wrapper"
import DeletableEdge from "./edge/deletable-edge"

import { createFlowNode } from "@/lib/helpers/workflow"
import { TaskType } from "@/types/task"
import { AppNode } from "@/types/app-node"

import { NODE_DIMENSIONS } from "@/constants/node"
import { TaskRegistry } from "@/configs/workflow/task-registry"

type Props = {
  workflow: Workflow
}

const nodeTypes = {
  ScrapeNode: NodeWrapper,
}

const edgeTypes = {
  default: DeletableEdge,
}

const snapGrid: [number, number] = [10, 10]
const fitViewOptions = { padding: 1 }

const FlowEditor = ({ workflow }: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const { getNodes, setViewport, screenToFlowPosition, updateNodeData } =
    useReactFlow()

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

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  // We are passing the taskType to the drop event to create a new node
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const taskType = event.dataTransfer.getData("application/reactflow")
      if (typeof taskType === "undefined" || !taskType) return

      const position = screenToFlowPosition({
        x: event.clientX - NODE_DIMENSIONS.WIDTH_PX / 2, // Center the node on drop!
        y: event.clientY,
      })

      const newNode = createFlowNode(taskType as TaskType, position)

      setNodes((nds) => {
        const updatedNodes = nds.concat(newNode)
        // console.log("@NODES After Drop", updatedNodes)
        return updatedNodes
      })
    },
    [screenToFlowPosition, setNodes]
  )

  // Function to handle connection of input & output handles
  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds))
      if (!connection.target) return
      // console.log("@CONNECTION", connection)

      // Don't use nodes state, it's not updated immediately
      // const node = nodes.find((n) => n.id === connection.target)

      // Use getNodes() to get the latest state!
      const currentNodes = getNodes()
      // console.log("@CURRENT NODES", currentNodes)
      // Remove input if already present before the connection
      const targetNode = currentNodes.find(
        (n) => n.id === connection.target
      ) as AppNode
      if (!targetNode) return
      // console.log("@TARGET NODE", targetNode)
      updateNodeData(targetNode.id, {
        inputs: {
          ...targetNode.data.inputs,
          [connection.targetHandle as string]: "",
        },
      })
    },
    [setEdges, updateNodeData]
  )

  const handleValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // No same node connection
      if (connection.source === connection.target) return false

      const sourceNode = nodes.find((n) => n.id === connection.source)
      const targetNode = nodes.find((n) => n.id === connection.target)
      if (!sourceNode || !targetNode) return false
      // console.log("@@DEBUG", sourceNode, targetNode)

      const sourceTask = TaskRegistry[sourceNode.data.type]
      const targetTask = TaskRegistry[targetNode.data.type]
      // console.log("@@DEBUG", sourceTask, targetTask)

      const sourceOuput = sourceTask.outputs.find(
        (o) => o.name === connection.sourceHandle
      )
      const targetInput = targetTask.inputs.find(
        (i) => i.name === connection.targetHandle
      )
      console.log("@@DEBUG", sourceOuput, targetInput)

      // Return false if the type is not same
      if (sourceOuput?.type !== targetInput?.type) return false

      // Check cycles
      const hasCycle = (node: AppNode, visited = new Set()) => {
        if (visited.has(node.id)) return false
        visited.add(node.id)

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true
          if (hasCycle(outgoer, visited)) return true
        }
      }
      const detectCycle = hasCycle(targetNode)
      return !detectCycle
    },
    [nodes]
  )

  return (
    <main className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        fitView={true} // Center the view on load, Remove this to use saved viewport
        fitViewOptions={fitViewOptions}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onConnect={handleConnect}
        isValidConnection={handleValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={10} size={0.75} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor
