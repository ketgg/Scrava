import { Suspense } from "react"
import PeriodSelectorWrapper from "./_components/period-selector-wrapper"
import { PeriodType } from "@/types/analytics"
import { Skeleton } from "@/components/ui/skeleton"
import StatsCards from "./_components/stats-cards"
import StatsExecutionStatus from "./_components/stats-execution-status"
import CreditsUsageInPeriod from "./_components/credits-usage-in-period"

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>
}) => {
  const currentDate = new Date()
  const { month, year } = await searchParams

  const period: PeriodType = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  }
  return (
    <div className="flex flex-1 flex-col h-full gap-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold ">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={"Loading..."}>
          <StatsCards selectedPeriod={period} />
        </Suspense>

        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditsUsageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  )
}

export default Home
