"use client"

import Link from "next/link"

import React from "react"
import { useState } from "react"

import { Workflow } from "@prisma/client"

import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import TooltipWrapper from "@/components/wrapper/tooltip"

import DeleteWorkflow from "./delete-workflow"
import RunButton from "./run-btn"

import { WorkflowExecutionStatus, WorkflowStatus } from "@/types/workflow"

import { cn } from "@/lib/utils"
import {
  ChevronRight,
  Clock,
  Coins,
  CornerDownRight,
  CornerRightDown,
  FileText,
  MoreVertical,
  MoveRight,
  Pencil,
  PencilLine,
  Play,
  Shuffle,
  Trash,
  Trash2,
} from "lucide-react"
import SchedulerDialog from "./scheduler-dialog"
import { Badge } from "@/components/ui/badge"
import { format, formatDistanceToNow } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"
import ExecutionStatusIndicator, {
  ExecutionStatusLabel,
} from "@/app/workflow/runs/[workflowId]/_components/execution-status-indicator"
import next from "next"

type Props = {
  workflow: Workflow
}

const workflowStatusColors = {
  [WorkflowStatus.DRAFT]: "bg-yellow-200 text-yellow-600",
  [WorkflowStatus.PUBLISHED]: "bg-green-200 text-green-600",
}

const WorkflowCard = ({ workflow }: Props) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT
  const isPublished = workflow.status === WorkflowStatus.PUBLISHED
  return (
    <Card className="shadow-none hover:shadow-sm transition-shadow duration-150">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center justify-end space-x-2">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              workflowStatusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <PencilLine className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </div>
          <div>
            <h3 className="flex items-center text-sm font-medium text-muted-foreground">
              <Link
                className="flex items-center hover:underline"
                href={`/workflow/editor/${workflow.id}`}
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Draft
                </span>
              )}
              {isPublished && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Published
                </span>
              )}
            </h3>
            <ScheduleSection
              isDraft={workflow.status === "DRAFT"}
              creditsCost={workflow.creditsCost}
              workflowId={workflow.id}
              cron={workflow.cron}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isPublished && <RunButton workflowId={workflow.id} />}
          <Link
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex items-center gap-2"
            )}
            href={`/workflow/editor/${workflow.id}`}
          >
            <Shuffle size={16} />
            Edit
          </Link>
          <WorkflowActions workflow={workflow} />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} />
    </Card>
  )
}

const ScheduleSection = ({
  isDraft,
  creditsCost,
  workflowId,
  cron,
}: {
  isDraft: boolean
  creditsCost: number
  workflowId: string
  cron: string | null
}) => {
  if (isDraft) return null
  return (
    <div className="flex items-center gap-2">
      <CornerDownRight size={16} className="text-muted-foreground" />
      {/* Adding cron in key so whenever cron values changes i.e. when we remove cron in cron dialog component rerenders */}
      {/* Lol nvm not working TODO - Find a better way */}
      <SchedulerDialog
        workflowId={workflowId}
        cron={cron}
        key={`${cron}-${workflowId}`}
      />
      <MoveRight className="h-4 w-4 text-muted-foreground" />
      <TooltipWrapper content="Credit consumption for full run">
        <div className="flex items-center gap-3">
          <Badge
            variant={"outline"}
            className="text-muted-foreground rounded-full"
          >
            <Coins className="h-4 w-4" />
            <span className="text-sm">{creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  )
}

const WorkflowActions = ({ workflow }: Props) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  return (
    <>
      <DeleteWorkflow
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflow={workflow}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon-sm">
            <TooltipWrapper content="More actions">
              <div className="flex items-center justify-center w-full h-full">
                <MoreVertical size={16} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              setShowDeleteDialog((prev) => !prev)
            }}
            className="flex items-center gap-2 text-destructive"
          >
            <Trash2 size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

const LastRunDetails = ({ workflow }: { workflow: Workflow }) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT
  if (isDraft) {
    return null
  }
  const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow
  const formattedStartedAt =
    lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true })

  const nextSchedule = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm")
  const nextScheduleUTC =
    nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm")
  return (
    <div className="bg-primary/5 px-4 py-1 flex justify-between items-center text-muted-foreground">
      <div className="flex items-center text-sm gap-2">
        {lastRunAt && (
          <Link
            href={`/workflow/runs/${workflow.id}/${lastRunId}`}
            className="flex items-center text-sm gap-2 group"
          >
            <span>Last run:</span>
            <ExecutionStatusIndicator
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <ExecutionStatusLabel
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            {/* <span>{lastRunStatus}</span> */}
            <span>{formattedStartedAt}</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-2 transition"
            />
          </Link>
        )}
        {!lastRunAt && <p>No runs yet</p>}
      </div>
      {nextRunAt && (
        <div className="flex items-center gap-2 text-sm">
          <Clock size={12} />
          <span>Next run at:</span>
          <span>{nextSchedule}</span>
          <span className="text-sm">({nextScheduleUTC} UTC)</span>
        </div>
      )}
    </div>
  )
}

export default WorkflowCard
