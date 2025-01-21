"use client"

import { useRouter } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"

import React from "react"
import { PlayIcon } from "lucide-react"
import { useReactFlow } from "@xyflow/react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import useExecutionPlan from "@/hooks/use-execution-plan"

import { runWorkflow } from "@/actions/workflow"

type Props = {
  workflowId: string
}

const ExecuteButton = ({ workflowId }: Props) => {
  const generate = useExecutionPlan()
  const { toObject } = useReactFlow()
  const router = useRouter()

  const runMutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: (execution) => {
      toast.success("Execution started successfully", {
        id: "workflow-execution",
      })
      // router.push(`/workflow/runs/${workflowId}/${execution.id}`)
    },
    onError: (err) => {
      if (isRedirectError(err)) {
        // Ignore redirect errors
        return
      }
      toast.error("Failed to start the execution", { id: "workflow-execution" })
    },
  })

  return (
    <Button
      disabled={runMutation.isPending}
      onClick={() => {
        const plan = generate()
        // console.table("@@DEBUG - Execution Plan", plan)
        if (!plan) return // Client side validation!
        runMutation.mutate({
          workflowId,
          workflowDefinition: JSON.stringify(toObject()),
        })
      }}
      variant="outline"
      className="flex items-center"
    >
      <PlayIcon />
      Execute
    </Button>
  )
}

export default ExecuteButton
