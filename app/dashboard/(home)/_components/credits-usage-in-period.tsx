import {
  creditsUsageInPeriod,
  getWorkflowExecutionStats,
} from "@/actions/analytics"
import { PeriodType } from "@/types/analytics"
import React from "react"
import ExecutionStatusChart from "./execution-status-chart"
import CreditsUsageChart from "./credits-usage-chart"

type Props = {
  selectedPeriod: PeriodType
}

const CreditsUsageInPeriod = async ({ selectedPeriod }: Props) => {
  const data = await creditsUsageInPeriod(selectedPeriod)
  return (
    <CreditsUsageChart
      data={data}
      title="Daily credits spent"
      description="Daily credits consumed in selected period."
    />
  )
}

export default CreditsUsageInPeriod
