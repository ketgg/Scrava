import React from "react"

import {
  EdgeProps,
  BaseEdge,
  getSmoothStepPath,
  EdgeLabelRenderer,
  useReactFlow,
  getBezierPath,
  getSimpleBezierPath,
} from "@xyflow/react"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

const DeletableEdge = (props: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath(props)
  const { setEdges } = useReactFlow()
  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            pointerEvents: "all",
            position: "absolute",
            transform: `translate(${labelX}px, ${labelY}px) translate(-50%, -50%)`,
          }}
        >
          <Button
            onClick={() => {
              setEdges((edges) => edges.filter((edge) => edge.id !== props.id))
            }}
            variant="outline"
            size="icon-xs"
            className={cn(
              "rounded-full hover:bg-destructive hover:text-destructive-foreground"
            )}
          >
            <X />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default DeletableEdge
