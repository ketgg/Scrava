import React from "react"

import { getExecutionWithPhases } from "@/actions/workflow"

import ExecutionViewer from "./execution-viewer"

type Props = {
  executionId: string
}

const ExecutionViewerWrapper = async ({ executionId }: Props) => {
  const execution = await getExecutionWithPhases(executionId)
  if (!execution) return <div>Execution not found</div>

  return <ExecutionViewer initialExecData={execution} />
}

export default ExecutionViewerWrapper
