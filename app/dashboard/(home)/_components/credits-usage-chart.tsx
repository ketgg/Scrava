"use client"
import {
  creditsUsageInPeriod,
  getWorkflowExecutionStats,
} from "@/actions/analytics"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartColumnStacked, Coins, Layers2 } from "lucide-react"
import React from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"

type ChartData = Awaited<ReturnType<typeof creditsUsageInPeriod>>

type Props = {
  data: ChartData
  title: string
  description: string
}

const CreditsUsageChart = ({ data, title, description }: Props) => {
  const chartConfig = {
    success: {
      label: "Successfull Phases Credits",
      color: "hsl(var(--chart-2))",
    },
    failed: {
      label: "Failed Phases Credits",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl fontbld flex items-center gap-2">
          <ChartColumnStacked className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <BarChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Bar
              fill="var(--color-success)"
              fillOpacity={0.8}
              stroke="var(--color-success)"
              dataKey={"success"}
              stackId={"a"}
            />
            <Bar
              fill="var(--color-failed)"
              fillOpacity={0.6}
              stroke="var(--color-failed)"
              dataKey={"failed"}
              stackId={"a"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default CreditsUsageChart
