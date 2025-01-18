import React, { Suspense } from "react"

import UserWorkflows from "./_components/user-workflows"
import UserWorkflowsSkeleton from "./_components/user-workflows-skeleton"
import CreateWorkflow from "./_components/create-workflow"

type Props = {}

const WorkflowsPage = (props: Props) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold"> Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflow />
      </div>

      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  )
}

export default WorkflowsPage
