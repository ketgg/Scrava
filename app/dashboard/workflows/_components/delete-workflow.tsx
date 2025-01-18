"use client"

import React from "react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { Workflow } from "@prisma/client"

import { deleteWorkflow } from "@/actions/workflow"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  workflow: Workflow
}

const DeleteWorkflow = ({ open, setOpen, workflow }: Props) => {
  const { mutate, isPending } = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      toast.success("Workflow deleted successfully", { id: workflow.id })
      setOpen(false)
    },
    onError: () => {
      toast.error("Failed to delete workflow", { id: workflow.id })
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="">
            <span className="text-destructive">
              This action cannot be undone!
            </span>
            <br />
            It will permanently delete and remove your workflow from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => {
              toast.loading("Deleting workflow...", { id: workflow.id })
              mutate(workflow.id)
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteWorkflow
