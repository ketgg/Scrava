import React from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"

import Editor from "../../_components/editor"

type Props = {
  params: Promise<{
    id: string
  }>
}

const WorkflowEditorPage = async ({ params }: Props) => {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) redirect("/auth/sign-in")

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId,
    },
  })
  if (!workflow) redirect("/dashboard/workflows")

  return <Editor workflow={workflow} />
}

export default WorkflowEditorPage
