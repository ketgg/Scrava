import React from "react"
import { AlertCircle, GitFork } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import CreateWorkflow from "./create-workflow"
import WorkflowCard from "./workflow-card"

import { getUserWorkflows } from "@/actions/workflow"

type Props = {}

const UserWorkflows = async (props: Props) => {
  const workflows = await getUserWorkflows()
  // console.log(workflows)
  if (!workflows) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center">
        <div className="flex items-center justify-center w-20 h-20 bg-accent rounded-full">
          <GitFork size={40} className="stroke-primary" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No workflows found</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first workflow
          </p>
        </div>
        <CreateWorkflow triggerText="Create your first Workflow" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  )
}

export default UserWorkflows
