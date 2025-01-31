import { getStatsCardsValues } from "@/actions/analytics"
import { PeriodType } from "@/types/analytics"
import { CirclePlay, Coins, Waypoints } from "lucide-react"
import React from "react"
import StatsCard from "./stats-card"

type Props = {
  selectedPeriod: PeriodType
}

const StatsCards = async ({ selectedPeriod }: Props) => {
  const data = await getStatsCardsValues(selectedPeriod)
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow Executions"
        value={data.workflowExecutions}
        icon={CirclePlay}
      />
      <StatsCard
        title="Phase Executions"
        value={data.phaseExecutions}
        icon={Waypoints}
      />
      <StatsCard
        title="Credits Consumed"
        value={data.creditsConsumed}
        icon={Coins}
      />
    </div>
  )
}

export default StatsCards
