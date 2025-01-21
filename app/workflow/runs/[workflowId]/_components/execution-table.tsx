"use client"

import { useRouter } from "next/navigation"
import React from "react"
import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { Coins } from "lucide-react"

import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

import ExecutionStatusIndicator from "./execution-status-indicator"

import { getWorkflowExecutions } from "@/actions/workflow"

import { datesToDurationString } from "@/lib/helpers/dates"
import { WorkflowExecutionStatus } from "@/types/workflow"

type initialExecsType = Awaited<ReturnType<typeof getWorkflowExecutions>>

type Props = {
  workflowId: string
  initialExecs: initialExecsType
}

const ExecutionsTable = ({ workflowId, initialExecs }: Props) => {
  const router = useRouter()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["executions", workflowId],
    initialData: initialExecs,
    queryFn: () => getWorkflowExecutions(workflowId),
    refetchInterval: 5000,
  })

  return (
    <div className="overflow-auto">
      <Table className="h-full">
        <TableHeader>
          <TableRow>
            <TableHead>Execution ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Credits Consumed</TableHead>
            <TableHead className="text-right">Started At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="gap-2 h-full text-sm">
          {data.map((execution) => {
            const duration = datesToDurationString(
              execution.startedAt,
              execution.completedAt
            )

            const formattedStartedAt =
              execution.startedAt &&
              formatDistanceToNow(execution.startedAt, {
                addSuffix: true,
              })
            return (
              <TableRow
                key={execution.id}
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    `/workflow/runs/${execution.workflowId}/${execution.id}`
                  )
                }
              >
                <TableCell className="">
                  <div className="flex flex-col">
                    <span className="font-medium">{execution.id}</span>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <span>Trigger type</span>
                      <Badge
                        className="rounded-full font-medium"
                        variant="outline"
                      >
                        {execution.trigger}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <ExecutionStatusIndicator
                        status={execution.status as WorkflowExecutionStatus}
                      />
                      <span className="font-semibold capitalize">
                        {execution.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-4">
                      {duration}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Coins size={16} className="text-primary" />
                      <span className="font-semibold capitalize">
                        {execution.creditsConsumed}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-4">
                      Credits
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formattedStartedAt}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default ExecutionsTable
