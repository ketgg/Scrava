import { PeriodType } from "@/types/analytics"
import { endOfMonth, startOfMonth } from "date-fns"

export const periodToDateRange = (period: PeriodType) => {
  const startDate = startOfMonth(new Date(period.year, period.month))
  const endDate = endOfMonth(new Date(period.year, period.month))
  return { startDate, endDate }
}
