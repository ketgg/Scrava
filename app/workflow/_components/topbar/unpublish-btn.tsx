"use client"

import { isRedirectError } from "next/dist/client/components/redirect-error"

import React from "react"
import { CloudDownload, CloudUpload, PlayIcon } from "lucide-react"
import { useReactFlow } from "@xyflow/react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import useExecutionPlan from "@/hooks/use-execution-plan"

import { unpublishWorkflow } from "@/actions/workflow"

type Props = {
  workflowId: string
}

const UnpublishButton = ({ workflowId }: Props) => {
  const generate = useExecutionPlan()
  const { toObject } = useReactFlow()

  const unpublishMutation = useMutation({
    mutationFn: unpublishWorkflow,
    onSuccess: (execution) => {
      toast.success("Workflow unpublished successfully", { id: workflowId })
      // router.push(`/workflow/runs/${workflowId}/${execution.id}`)
    },
    onError: (err) => {
      if (isRedirectError(err)) {
        toast.success("Workflow unpublished successfully", { id: workflowId })
        // Ignore redirect errors
        return
      }
      toast.error("Failed to unpublish the workflow", { id: workflowId })
    },
  })

  return (
    <Button
      disabled={unpublishMutation.isPending}
      onClick={() => {
        const plan = generate()
        // console.table("@@DEBUG - Execution Plan", plan)
        if (!plan) return // Client side validation!
        toast.loading("Unpublishing workflow...", { id: workflowId })
        unpublishMutation.mutate(workflowId)
      }}
      variant="default"
      className="flex items-center"
    >
      <CloudDownload />
      Unpublish
    </Button>
  )
}

export default UnpublishButton
