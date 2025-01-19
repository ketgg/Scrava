import React, { Suspense } from "react"
import { Loader2 } from "lucide-react"

import Topbar from "@/app/workflow/_components/topbar"
import ExecutionViewerWrapper from "@/app/workflow/_components/execution/execution-viewer-wrapper"

type Props = {
  params: Promise<{ workflowId: string; executionId: string }>
}

const ExecutionViewerPage = async ({ params }: Props) => {
  const { workflowId, executionId } = await params
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        title="Workflow Execution Details"
        subtitle={`Execution ID: ${executionId}`}
        workflowId={workflowId}
        hideButtons={true}
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  )
}

export default ExecutionViewerPage
