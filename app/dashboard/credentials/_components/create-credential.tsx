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

import { createWorkflow } from "@/actions/workflow"
import {
  createCredentialSchema,
  CreateCredentialSchemaType,
} from "@/schema/credential"
import { createCredential } from "@/actions/credentials"

type Props = {
  triggerText?: string
}

const CreateCredential = ({ triggerText }: Props) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<CreateCredentialSchemaType>({
    resolver: zodResolver(createCredentialSchema),
    defaultValues: {
      name: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createCredential,
    onSuccess: (workflowId) => {
      toast.success("Credential created successfully", {
        id: "create-credential",
      })
      form.reset()
      setIsOpen(false)
    },
    onError: () => {
      toast.error("Failed to create credential", { id: "create-credential" })
    },
  })

  // We use useCallback to prevent unnecessary re-renders
  // and call again only when the dependencies change
  const onSubmit = useCallback(
    (values: CreateCredentialSchemaType) => {
      toast.loading("Creating credetial...", { id: "create-credential" })
      mutate(values)
    },
    [mutate]
  )

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Credential</DialogTitle>
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
                      Enter an unique and descriptive name for the credential.
                      <br />
                      This name will be used to identify the credential.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Value
                      <p className="text-primary">*</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the value associated with the credential.
                      <br />
                      This value will be securely encrypted and stored.
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

export default CreateCredential
