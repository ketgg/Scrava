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

import { WorkflowStatus } from "@/types/workflow"

import { cn } from "@/lib/utils"
import {
  FileText,
  MoreVertical,
  Pencil,
  PencilLine,
  Play,
  Shuffle,
  Trash,
  Trash2,
} from "lucide-react"

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
    </Card>
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

export default WorkflowCard
