import { DeliverViaWebhookTask } from "@/configs/workflow/task"

import { ExecutionEnv } from "@/types/executor"
import { env } from "process"

export const deliverViaWebhookExecutor = async (
  environment: ExecutionEnv<typeof DeliverViaWebhookTask>
): Promise<boolean> => {
  try {
    const targetUrl = environment.getInput("Target URL")
    if (!targetUrl) {
      environment.log.error("Input:Target URL not defined.")
    }

    const body = environment.getInput("Body")
    if (!body) {
      environment.log.error("Input:Body not defined.")
    }

    const response = fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const statusCode = (await response).status
    if (statusCode !== 200) {
      environment.log.error(`Status Code: ${statusCode}`)
      return false
    }

    const responseBody = await (await response).json()
    environment.log.info(JSON.stringify(responseBody))

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    // console.error("Error in pageToHtmlExecutor:", error)
    return false
  }
}
