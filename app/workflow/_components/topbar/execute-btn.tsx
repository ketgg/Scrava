"use client"

import React from "react"
import { PlayIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import useExecutionPlan from "@/hooks/use-execution-plan"

type Props = {
  workflowId: string
}

const ExecuteButton = ({ workflowId }: Props) => {
  const generate = useExecutionPlan()
  return (
    <Button
      onClick={() => {
        const plan = generate()
        // console.table("@@DEBUG - Execution Plan", plan)
      }}
      variant="outline"
      className="flex items-center"
    >
      <PlayIcon />
      Execute
    </Button>
  )
}

export default ExecuteButton
