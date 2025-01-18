"use client"

import React from "react"
import { useMutation } from "@tanstack/react-query"
import { useReactFlow } from "@xyflow/react"
import { toast } from "sonner"

import { HardDriveUpload, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { updateWorkflow } from "@/actions/workflow"

type Props = {
  workflowId: string
}

const SaveButton = ({ workflowId }: Props) => {
  const { toObject } = useReactFlow()

  const { mutate: saveMutation, isPending } = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: () => {
      toast.success("Workflow saved successfully", { id: "save-workflow" })
    },
    onError: () => {
      toast.error("Failed to save workflow", { id: "save-workflow" })
    },
  })
  return (
    <Button
      disabled={isPending}
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject())
        toast.loading("Saving workflow...", { id: "save-workflow" })
        saveMutation({ id: workflowId, definition: workflowDefinition })
      }}
      variant="outline"
      className="flex items-center"
    >
      <HardDriveUpload />
      {isPending ? "Saving" : "Save"}
    </Button>
  )
}

export default SaveButton
