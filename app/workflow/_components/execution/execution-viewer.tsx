"use client"

import React, { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Calendar,
  CircleDashed,
  Clock,
  ClockIcon,
  Coins,
  CoinsIcon,
  GitFork,
  Loader2,
} from "lucide-react"

import { formatDistanceToNow } from "date-fns"

import ExecutionLabel from "./execution-label"
import ParameterViewer from "./parameter-viewer"
import LogViewer from "./log-viewer"
import PhaseStatusBadge from "./phase-status-badge"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  getExecutionWithPhases,
  getWorkflowPhaseDetails,
} from "@/actions/workflow"

import {
  WorkflowExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow"

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
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  })

  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING

  // Auto select the phase that are running
  useEffect(() => {
    const phases = query.data?.phases || []
    if (isRunning) {
      // Sort the phases by startedAt in descending order
      const phaseToSelect = phases.toSorted((a, b) =>
        a.startedAt! > b.startedAt! ? -1 : 1
      )[0]
      setSelectedPhase(phaseToSelect.id)
      return
    }
    // When user refreshes the page, we select the last phase
    const lastPhase = phases.toSorted((a, b) =>
      a.completedAt! > b.completedAt! ? -1 : 1
    )[0]
    setSelectedPhase(lastPhase.id)
  }, [query.data?.phases, isRunning, setSelectedPhase])

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
            value={
              <div className="flex items-center gap-2 font-medium capitalize">
                {/* TODO: Add a better status badge */}
                {/* Currently we are casting the execution status as a phase status */}
                <PhaseStatusBadge
                  status={query.data?.status as WorkflowExecutionPhaseStatus}
                />
                <span>{query.data?.status}</span>
              </div>
            }
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
              {/* <span className="text-muted-foreground text-xs">
                {phase.status}
              </span> */}
              <PhaseStatusBadge
                status={phase.status as WorkflowExecutionPhaseStatus}
              />
            </Button>
          ))}
        </div>
      </aside>
      <div className="flex px-4 w-full h-full">
        {isRunning && (
          <div className="flex flex-col items-center justify-center gap-2 h-full w-full">
            <p className="font-semibold">Executing workflow, please wait...</p>
          </div>
        )}
        {!isRunning && !selectedPhase && (
          <div className="flex flex-col gap-2 items-center justify-center h-full w-full">
            <div className="flex flex-col gap-1 text-center">
              <p className="font-bold">No phase selected</p>{" "}
              <p className="text-sm text-muted-foreground">
                Select a phase to view details
              </p>
            </div>
          </div>
        )}
        {!isRunning && selectedPhase && (
          <div className="flex flex-col gap-4 py-4 overflow-auto h-full w-full">
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className="space-x-2 rounded-full">
                <div className="flex items-center gap-1">
                  <CoinsIcon size={16} className="stroke-muted-foreground" />
                  <span>Credits</span>
                </div>
                <span>{phaseDetailsQuery.data?.creditsConsumed || "-"}</span>
              </Badge>
              <Badge variant="outline" className="space-x-2 rounded-full">
                <div className="flex items-center gap-1">
                  <ClockIcon size={16} className="stroke-muted-foreground" />
                  <span>Duration</span>
                </div>
                <span>
                  {datesToDurationString(
                    phaseDetailsQuery.data?.startedAt,
                    phaseDetailsQuery.data?.completedAt
                  ) || "-"}
                </span>
              </Badge>
            </div>
            <ParameterViewer
              title="Inputs"
              subtitle="Inputs generated in this phase"
              paramsJSON={phaseDetailsQuery.data?.inputs || undefined}
            />
            <ParameterViewer
              title="Outputs"
              subtitle="Outputs generated in this phase"
              paramsJSON={phaseDetailsQuery.data?.outputs || undefined}
            />
            <LogViewer logs={phaseDetailsQuery.data?.execLogs} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ExecutionViewer
