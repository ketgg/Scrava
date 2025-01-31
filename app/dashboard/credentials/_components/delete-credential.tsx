"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { Loader2, Trash2 } from "lucide-react"

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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteCredential } from "@/actions/credentials"

type Props = {
  name: string
}

const DeleteCredential = ({ name }: Props) => {
  const [open, setOpen] = useState(false)
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationFn: deleteCredential,
    onSuccess: () => {
      toast.success("Credential deleted successfully", {
        id: "delete-credential",
      })
    },
    onError: () => {
      toast.error("Failed to delete credential", { id: "delete-credential" })
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"icon"}>
          <Trash2 size={18} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="">
            <span className="text-destructive">
              This action cannot be undone!
            </span>
            <br />
            It will permanently delete and remove your credential from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => {
              toast.loading("Deleting credential...", {
                id: "delete-credential",
              })
              deleteMutation(name)
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

export default DeleteCredential
