"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

import { Edge } from "@xyflow/react"

import {
  createWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/schema/workflow"

import { WorkflowStatus } from "@/types/workflow"
import { AppNode } from "@/types/app-node"

import { createFlowNode } from "@/lib/helpers/workflow"
import { TaskType } from "@/types/task"

export const getUserWorkflows = async () => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthenticated")

    const workflows = await prisma.workflow.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return workflows
  } catch (error) {
    console.log("Error in getUserWorkflows:", error)
  }
}

export const createWorkflow = async (data: CreateWorkflowSchemaType) => {
  try {
    const { success, data: validatedData } =
      createWorkflowSchema.safeParse(data)
    if (!success) throw new Error("Invalid form data")

    const { userId } = await auth()
    if (!userId) throw new Error("Unauthenticated")

    const initialDef: { nodes: AppNode[]; edges: Edge[] } = {
      nodes: [],
      edges: [],
    }
    initialDef.nodes.push(
      createFlowNode(TaskType.LAUNCH_BROWSER, { x: 0, y: 0 })
    )

    const workflow = await prisma.workflow.create({
      data: {
        userId: userId,
        status: WorkflowStatus.DRAFT,
        definition: JSON.stringify(initialDef),
        ...validatedData,
      },
    })
    if (!workflow) throw new Error("Failed to create workflow")

    return workflow.id
  } catch (error) {
    console.log("Error in createWorkflow:", error)
  }
}

export const deleteWorkflow = async (workflowId: string) => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthenticated")

    await prisma.workflow.delete({
      where: { id: workflowId, userId: userId },
    })
    revalidatePath("/dashboard/workflows")
  } catch (error) {
    console.log("Error in deleteWorkflow:", error)
  }
}

export const updateWorkflow = async ({
  id,
  definition,
}: {
  id: string
  definition: string
}) => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthenticated")

    const workflow = await prisma.workflow.findUnique({
      where: { id: id, userId: userId },
    })
    if (!workflow) throw new Error("Workflow not found")
    if (workflow.status !== WorkflowStatus.DRAFT)
      throw new Error("Workflow is not in draft mode")

    await prisma.workflow.update({
      where: { id: id, userId: userId },
      data: {
        definition: definition,
      },
    })
    revalidatePath(`/dashboard/workflows`)
  } catch (error) {
    console.log("Error in saveWorkflow:", error)
  }
}
