"use server"

import { periodToDateRange } from "@/lib/helpers/analytics"
import { prisma } from "@/lib/prisma"
import { PeriodType } from "@/types/analytics"
import {
  WorkflowExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"
import { exec } from "child_process"
import { eachDayOfInterval, format } from "date-fns"
import { date } from "zod"

export const getPeriods = async () => {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  const years = await prisma.workflowExecution.aggregate({
    where: { userId },
    _min: { startedAt: true },
  })

  const currentYear = new Date().getFullYear()

  const minYear = years._min.startedAt
    ? years._min.startedAt.getFullYear()
    : currentYear

  const periods: PeriodType[] = []

  for (let year = minYear; year <= currentYear; year++) {
    for (let month = 0; month <= 11; month++) {
      periods.push({ year, month })
    }
  }

  return periods
}

export const getStatsCardsValues = async (period: PeriodType) => {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  const dateRange = periodToDateRange(period)

  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: ["COMPLETED", "FAILED"],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
        select: { creditsConsumed: true },
      },
    },
  })

  const stats = {
    workflowExecutions: executions.length,
    creditsConsumed: 0,
    phaseExecutions: 0,
  }

  stats.creditsConsumed = executions.reduce(
    (sum, execution) => sum + (execution.creditsConsumed || 0),
    0
  )

  stats.phaseExecutions = executions.reduce(
    (sum, execution) => sum + execution.phases.length,
    0
  )

  return stats
}

export const getWorkflowExecutionStats = async (period: PeriodType) => {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  const dateRange = periodToDateRange(period)
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
  })

  const dateFormat = "yyyy-MM-dd"

  const stats: Record<
    string,
    {
      success: number
      failed: number
    }
  > = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, "yyyy-MM-dd"))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      }
      return acc
    }, {} as any)

  executions.forEach((execution) => {
    const date = format(execution.startedAt!, dateFormat)
    if (execution.status === WorkflowExecutionStatus.COMPLETED) {
      stats[date].success += 1
    }
    if (execution.status === WorkflowExecutionStatus.FAILED) {
      stats[date].failed += 1
    }
  })

  const result = Object.entries(stats).map(([date, infos]) => {
    return { date, ...infos }
  })

  return result
}

const { COMPLETED, FAILED } = WorkflowExecutionPhaseStatus

export const creditsUsageInPeriod = async (period: PeriodType) => {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  const dateRange = periodToDateRange(period)
  const executionPhases = await prisma.executionPhase.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [COMPLETED, FAILED],
      },
    },
  })

  const dateFormat = "yyyy-MM-dd"

  const stats: Record<
    string,
    {
      success: number
      failed: number
    }
  > = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, "yyyy-MM-dd"))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      }
      return acc
    }, {} as any)

  executionPhases.forEach((phase) => {
    const date = format(phase.startedAt!, dateFormat)
    if (phase.status === COMPLETED) {
      stats[date].success += phase.creditsConsumed || 0
    }
    if (phase.status === FAILED) {
      stats[date].failed += phase.creditsConsumed || 0
    }
  })

  const result = Object.entries(stats).map(([date, infos]) => {
    return { date, ...infos }
  })

  return result
}
