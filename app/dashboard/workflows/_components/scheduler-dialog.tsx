"use client"

import React, { useEffect, useState } from "react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Clock, Divide, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import { updateWorkflow } from "@/actions/workflow"
import { toast } from "sonner"
import { removeWorkflowSchedule, updateWorkflowCron } from "@/actions/cron"
import parser from "cron-parser"

import cronstrue from "cronstrue"
import { read } from "fs"

type Props = {
  workflowId: string
  cron: string | null
}

const SchedulerDialog = ({ workflowId, cron }: Props) => {
  const [cronInput, setCronInput] = useState(cron || "")
  const [validCron, setValidCron] = useState(false)
  const [readableCron, setReadableCron] = useState("")

  const mutation = useMutation({
    mutationFn: updateWorkflowCron,
    onSuccess: () => {
      toast.success("Schedule updated successfully", { id: "cron" })
    },
    onError: () => {
      toast.error("Something went wrong", { id: "cron" })
    },
  })

  const removeScheduleMutation = useMutation({
    mutationFn: removeWorkflowSchedule,
    onSuccess: () => {
      toast.success("Schedule removed successfully", { id: "cron" })
    },
    onError: () => {
      toast.error("Something went wrong", { id: "cron" })
    },
  })

  useEffect(() => {
    try {
      parser.parseExpression(cronInput)
      const readableCronStr = cronstrue.toString(cronInput)
      setValidCron(true)
      setReadableCron(readableCronStr)
    } catch (error) {
      setValidCron(false)
    }
  }, [cronInput])

  // Prevent flickering
  // If cron is coming from props that is server its already validated one!
  const workflowHasValidCron = cron && cron.length > 0
  const readableSavedCron = workflowHasValidCron && cronstrue.toString(cron)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"sm"}
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            workflowHasValidCron && "text-primary"
          )}
        >
          {workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <Clock />
              {readableSavedCron}
            </div>
          )}
          {!workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <TriangleAlert className="h-3 w-3" /> Set schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Schedule workflow execution</DialogTitle>
          <div className="p-6 space-y-4">
            <p className="text-muted-foreground text-sm">
              Specify a cron expression to schedule periodic workflow execution.
              All times are in UTC.
            </p>
            <Input
              placeholder="E.g. * * * * *"
              value={cronInput}
              onChange={(e) => setCronInput(e.target.value)}
            />

            {workflowHasValidCron && (
              <DialogClose asChild>
                <div className="">
                  <Button
                    onClick={() => {
                      toast.loading("Removing schedule...", { id: "cron" })
                      removeScheduleMutation.mutate({ id: workflowId })
                    }}
                    disabled={mutation.isPending}
                    variant={"outline"}
                    className="w-full text-destructive border-destructive hover:text-destructive"
                  >
                    Remove current schedule
                  </Button>
                </div>
              </DialogClose>
            )}

            <div
              className={cn(
                "bg-accent border text-sm p-4",
                validCron
                  ? "border-primary text-primary"
                  : "border-destructive text-destructive"
              )}
            >
              {validCron ? readableCron : "Invalid cron expression"}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full" variant={"secondary"}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="w-full"
              disabled={mutation.isPending || !validCron}
              onClick={() => {
                toast.loading("Saving...", { id: "cron" })
                mutation.mutate({ id: workflowId, cron: cronInput })
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SchedulerDialog
