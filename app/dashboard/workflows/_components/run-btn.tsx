"use client"

import React from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { PlayIcon } from "lucide-react"

import { runWorkflow } from "@/actions/workflow"

import { Button } from "@/components/ui/button"
import { isRedirectError } from "next/dist/client/components/redirect-error"

type Props = {
  workflowId: string
}

const RunButton = ({ workflowId }: Props) => {
  const runMutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: () => {
      toast.success("Execution started successfully", { id: workflowId })
    },
    onError: (error) => {
      if (isRedirectError(error)) {
        toast.success("Execution started successfully", { id: workflowId })
        return
      }
      toast.error("Failed to start execution", { id: workflowId })
    },
  })

  return (
    <Button
      disabled={runMutation.isPending}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={() => {
        toast.loading("Executing workflow...", { id: workflowId })
        runMutation.mutate({ workflowId })
      }}
    >
      <PlayIcon size={16} />
      Run
    </Button>
  )
}

export default RunButton
