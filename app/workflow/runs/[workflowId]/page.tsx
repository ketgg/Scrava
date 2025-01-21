import React, { Suspense } from "react"
import { GitFork, Loader2 } from "lucide-react"

import Topbar from "../../_components/topbar"
import ExecutionsTable from "./_components/execution-table"

import { getWorkflowExecutions } from "@/actions/workflow"

type Props = {
  params: Promise<{ workflowId: string }>
}

const ExecutionsPage = async ({ params }: Props) => {
  const { workflowId } = await params
  return (
    <div className="w-full h-full overflow-y-auto">
      <Topbar
        title="All Runs "
        hideButtons
        subtitle="List of all your workflow executions"
        workflowId={workflowId}
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full h-full">
            <Loader2
              size={24}
              strokeWidth={1.5}
              className="animate-spin stroke-primary"
            />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={workflowId} />
      </Suspense>
    </div>
  )
}

const ExecutionsTableWrapper = async ({
  workflowId,
}: {
  workflowId: string
}) => {
  console.log("workflowId", workflowId)
  const executions = await getWorkflowExecutions(workflowId)
  if (!executions) {
    return <div>No data</div>
  }
  if (executions.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center py-6">
        <div className="flex items-center justify-center w-20 h-20 bg-accent rounded-full">
          <GitFork size={40} className="stroke-primary" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">
            No runs have been triggered yet for this workflow
          </p>
          <p className="text-sm text-muted-foreground">
            You can trigger a run from the workflow editor page
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className="container px-4 py-2 max-w-6xl w-full mx-auto">
      <ExecutionsTable workflowId={workflowId} initialExecs={executions} />
    </div>
  )
}

export default ExecutionsPage
