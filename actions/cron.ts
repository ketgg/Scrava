"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import parser from "cron-parser"
import { revalidatePath } from "next/cache"

export const updateWorkflowCron = async ({
  id,
  cron,
}: {
  id: string
  cron: string
}) => {
  try {
    const interval = parser.parseExpression(cron, { utc: true })
    await prisma.workflow.update({
      where: { id },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    })
  } catch (error) {
    console.error("Error in updateWorkflowCron", error)
    throw new Error("Error in updateWorkflowCron")
  }

  revalidatePath("/dashboard/workflows")
}

export const removeWorkflowSchedule = async ({ id }: { id: string }) => {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }
  await prisma.workflow.update({
    where: { id },
    data: {
      cron: null,
      nextRunAt: null,
    },
  })
}
