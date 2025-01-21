import React from "react"
import { CircleDashed, Loader2, CircleX, CircleCheck } from "lucide-react"

import { WorkflowExecutionPhaseStatus } from "@/types/workflow"

type Props = {
  status: WorkflowExecutionPhaseStatus
}

const PhaseStatusBadge = ({ status }: Props) => {
  switch (status) {
    case WorkflowExecutionPhaseStatus.PENDING:
      return <CircleDashed size={20} className="stroke-muted-foreground" />
    case WorkflowExecutionPhaseStatus.RUNNING:
      return <Loader2 size={20} className="stroke-yellow-400 animate-spin" />
    case WorkflowExecutionPhaseStatus.FAILED:
      return <CircleX size={20} className="stroke-destructive" />
    case WorkflowExecutionPhaseStatus.COMPLETED:
      return <CircleCheck size={20} className="stroke-green-400" />
    default:
      return <div></div>
  }
}

export default PhaseStatusBadge
