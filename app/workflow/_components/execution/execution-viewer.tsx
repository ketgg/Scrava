"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Calendar,
  CircleDashed,
  Clock,
  Coins,
  GitFork,
  Loader2,
} from "lucide-react"

import { formatDistanceToNow } from "date-fns"

import ExecutionLabel from "./execution-label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  getExecutionWithPhases,
  getWorkflowPhaseDetails,
} from "@/actions/workflow"

import { WorkflowExecutionStatus } from "@/types/workflow"

import { datesToDurationString } from "@/lib/helpers/dates"
import { getPhasesTotalCost } from "@/lib/helpers/phases"

type ExecutionData = Awaited<ReturnType<typeof getExecutionWithPhases>>
type Props = {
  initialExecData: ExecutionData
}

const ExecutionViewer = ({ initialExecData }: Props) => {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)
  // We are fetching the initial execution data on server side
  // and then we are using the useQuery hook to refetch the data on the client side
  // every 1000ms if the status is RUNNING
  const query = useQuery({
    queryKey: ["execution", initialExecData?.id],
    initialData: initialExecData,
    queryFn: () => getExecutionWithPhases(initialExecData!.id),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  })

  const phaseDetailsQuery = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: selectedPhase !== null,
    queryFn: () => getWorkflowPhaseDetails(selectedPhase!),
  })

  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING

  const duration = datesToDurationString(
    query.data?.startedAt,
    query.data?.completedAt
  )

  const totalCreditsCost = getPhasesTotalCost(query.data?.phases || [])

  return (
    <div className="flex w-full h-full">
      <aside className="flex flex-col flex-grow w-[25rem] min-w-[25rem] max-w-[25rem] h-full border-r border-separate overflow-hidden">
        <div className="px-2 py-4">
          <ExecutionLabel
            icon={CircleDashed}
            label="Status"
            value={query.data?.status}
          />
          <ExecutionLabel
            icon={Calendar}
            label="Started at"
            value={
              <span className="lowercase">
                {query.data?.startedAt
                  ? formatDistanceToNow(new Date(query.data?.startedAt), {
                      addSuffix: true,
                    })
                  : "-"}
              </span>
            }
          />
          <ExecutionLabel
            icon={Clock}
            label="Duration"
            value={
              duration ? (
                duration
              ) : (
                <Loader2 size={20} className="animate-spin" />
              )
            }
          />
          <ExecutionLabel
            icon={Coins}
            label="Credits consumed"
            value={totalCreditsCost}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-center py-2 px-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GitFork size={20} className="stroke-muted-foreground/80" />
            <span className="font-medium">Phases</span>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-1 h-full overflow-auto px-2 py-4">
          {query.data?.phases.map((phase, index) => (
            <Button
              onClick={() => {
                if (isRunning) return
                setSelectedPhase(phase.id)
              }}
              key={phase.id}
              variant={selectedPhase === phase.id ? "secondary" : "ghost"}
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <Badge className="rounded-full">{index + 1}</Badge>
                <span className="font-medium">{phase.name}</span>
              </div>
              <span className="text-muted-foreground text-xs">
                {phase.status}
              </span>
            </Button>
          ))}
        </div>
      </aside>
      <div className="flex w-full h-full">
        <pre>{JSON.stringify(phaseDetailsQuery.data, null, 4)}</pre>
      </div>
    </div>
  )
}

export default ExecutionViewer
