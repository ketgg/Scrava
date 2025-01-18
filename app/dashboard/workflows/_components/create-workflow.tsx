"use client"

import { useRouter } from "next/navigation"

import React, { useCallback } from "react"
import { useState } from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  createWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/schema/workflow"

import { createWorkflow } from "@/actions/workflow"

type Props = {
  triggerText?: string
}

const CreateWorkflow = ({ triggerText }: Props) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<CreateWorkflowSchemaType>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {
      name: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createWorkflow,
    onSuccess: (workflowId) => {
      toast.success(
        "Workflow created successfully",
        // We update the same toast when the mutation is successful
        // Therefore, we need to pass an id to the toast
        { id: "create-workflow" }
      )
      setIsOpen(false)
      router.push(`/workflow/editor/${workflowId}`)
    },
    onError: () => {
      toast.error("Failed to create workflow", { id: "create-workflow" })
    },
  })

  // We use useCallback to prevent unnecessary re-renders
  // and call again only when the dependencies change
  const onSubmit = useCallback(
    (values: CreateWorkflowSchemaType) => {
      toast.loading("Creating workflow...", { id: "create-workflow" })
      mutate(values)
    },
    [mutate]
  )

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        form.reset()
        setIsOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create Workflow"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workflow</DialogTitle>
          <DialogDescription>Start building your workflow.</DialogDescription>
        </DialogHeader>
        <div className="">
          <Form {...form}>
            <form
              className="space-y-6 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-primary">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive and unique name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Description
                      {/* <p className="text-xs text-muted-foreground">
                        (optional)
                      </p> */}
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of your workflow.
                      <br />
                      This is optional but can help you remember what your
                      workflow does.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Proceed"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWorkflow
