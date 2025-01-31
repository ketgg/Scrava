import { getPeriods } from "@/actions/analytics"
import React from "react"
import PeriodSelector from "./period-selector"
import { PeriodType } from "@/types/analytics"

type Props = {
  selectedPeriod: PeriodType
}

const PeriodSelectorWrapper = async ({ selectedPeriod }: Props) => {
  const periods = await getPeriods()

  return <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />
}

export default PeriodSelectorWrapper
