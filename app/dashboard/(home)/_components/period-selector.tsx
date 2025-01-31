"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PeriodType } from "@/types/analytics"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

import React from "react"

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

type Props = {
  periods: PeriodType[]
  selectedPeriod: PeriodType
}

const PeriodSelector = ({ periods, selectedPeriod }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  return (
    <Select
      value={`${selectedPeriod.month}-${selectedPeriod.year}`}
      onValueChange={(value) => {
        const [month, year] = value.split("-")
        const params = new URLSearchParams(searchParams)
        params.set("month", month)
        params.set("year", year)
        router.push(`?${params.toString()}`)
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period, index) => {
          return (
            <SelectItem key={index} value={`${period.month}-${period.year}`}>
              {`${MONTH_NAMES[period.month]} ${period.year}`}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

export default PeriodSelector
