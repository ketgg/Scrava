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

const labelColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "text-slate-400",
  RUNNING: "text-yellow-400",
  FAILED: "text-red-400",
  COMPLETED: "text-green-400",
}

export const ExecutionStatusLabel = ({ status }: Props) => {
  return <span className={cn("lowercase", labelColors[status])}>{status}</span>
}
