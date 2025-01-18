"use client"

import React from "react"
import { useReactFlow } from "@xyflow/react"

import { cn } from "@/lib/utils"

type Props = {
  nodeId: string
  isSelected: boolean
  children: React.ReactNode
}

const NodeCard = ({ nodeId, isSelected, children }: Props) => {
  const { getNode, setCenter } = useReactFlow()

  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId)
        if (!node) return
        const { position, measured } = node
        if (!position || !measured) return
        const { width, height } = measured
        const x = position.x + width! / 2
        const y = position.y + height! / 2
        if (x === undefined || y === undefined) return
        setCenter(x, y, {
          zoom: 1,
          duration: 200,
        })
      }}
      className={cn(
        "flex flex-col gap-1 text-xs w-[25rem] border border-separate bg-background rounded-none",
        isSelected && "border-primary"
      )}
    >
      {children}
    </div>
  )
}

export default NodeCard
