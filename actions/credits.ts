"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { LogCollector } from "@/types/log"

export const getUserBalance = async () => {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthenticated")

  const balance = await prisma.userBalance.findUnique({
    where: {
      userId,
    },
  })
  if (!balance) return -1

  return balance.credits
}

export const decrementUserBalance = async (
  userId: string,
  amount: number,
  logCollector: LogCollector
) => {
  try {
    const currentBalance = await prisma.userBalance.findUnique({
      where: { userId },
    })
    if (!currentBalance || currentBalance.credits < amount) {
      logCollector.error("Insufficient credits")
      return false
    }

    // Proceed with decrement if sufficient credits are available
    await prisma.userBalance.update({
      where: { userId },
      data: {
        credits: {
          decrement: amount,
        },
      },
    })
    return true
  } catch (error) {
    console.error("Error in decrementUserBalance", error)
    return false
  }
}
