"use client"

import { isRedirectError } from "next/dist/client/components/redirect-error"

import React from "react"
import { CloudUpload, PlayIcon } from "lucide-react"
import { useReactFlow } from "@xyflow/react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import useExecutionPlan from "@/hooks/use-execution-plan"

import { publishWorkflow } from "@/actions/workflow"

type Props = {
  workflowId: string
}

const PublishButton = ({ workflowId }: Props) => {
  const generate = useExecutionPlan()
  const { toObject } = useReactFlow()

  const publishMutation = useMutation({
    mutationFn: publishWorkflow,
    onSuccess: (execution) => {
      toast.success("Workflow published successfully", { id: workflowId })
      // router.push(`/workflow/runs/${workflowId}/${execution.id}`)
    },
    onError: (err) => {
      if (isRedirectError(err)) {
        toast.success("Workflow published successfully", { id: workflowId })
        // Ignore redirect errors
        return
      }
      toast.error("Failed to publish the workflow", { id: workflowId })
    },
  })

  return (
    <Button
      disabled={publishMutation.isPending}
      onClick={() => {
        const plan = generate()
        // console.table("@@DEBUG - Execution Plan", plan)
        if (!plan) return // Client side validation!
        toast.loading("Publishing workflow...", { id: workflowId })
        publishMutation.mutate({
          workflowId,
          definition: JSON.stringify(toObject()),
        })
      }}
      variant="default"
      className="flex items-center"
    >
      <CloudUpload />
      Publish
    </Button>
  )
}

export default PublishButton
