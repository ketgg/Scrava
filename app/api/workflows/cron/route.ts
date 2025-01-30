import { prisma } from "@/lib/prisma"
import { WorkflowStatus } from "@/types/workflow"
import { SITE_URL } from "@/constants/site"

export const GET = async (request: Request) => {
  const now = new Date()
  const workflows = await prisma.workflow.findMany({
    select: { id: true },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: { lte: now },
    },
  })

  for (const workflow of workflows) {
    triggerWorkflow(workflow.id)
  }

  return Response.json({ workflowsToRun: workflows.length }, { status: 200 })
}

export const triggerWorkflow = (workflowId: string) => {
  const triggerUrl = `${SITE_URL}/api/workflows/execute?workflowId=${workflowId}`
  // console.log(triggerUrl)
  fetch(triggerUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET!}`,
    },

    // signal: AbortSignal.timeout(5000),
  }).catch((error) => {
    console.error(
      "Error triggering workflow with ID",
      workflowId,
      ":Error ->",
      error.message
    )
  })
}
