import React from "react"

import { cn } from "@/lib/utils"

import { WorkflowExecutionStatus } from "@/types/workflow"

const indicatorColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "bg-slate-400",
  RUNNING: "bg-yellow-400",
  FAILED: "bg-red-400",
  COMPLETED: "bg-green-400",
}

type Props = {
  status: WorkflowExecutionStatus
}

const ExecutionStatusIndicator = ({ status }: Props) => {
  return <div className={cn("w-2 h-2 rounded-full", indicatorColors[status])} />
}

export default ExecutionStatusIndicator
