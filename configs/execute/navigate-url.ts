import { NavigateURLTask } from "@/configs/workflow/task"

import { ExecutionEnv } from "@/types/executor"

export const navigateURLExecutor = async (
  environment: ExecutionEnv<typeof NavigateURLTask>
): Promise<boolean> => {
  try {
    const url = environment.getInput("URL")
    if (!url) {
      environment.log.error("Input:URL not defined.")
    }

    await environment.getPage()?.goto(url)

    environment.log.info(`Visited URL: ${url}`)

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    // console.error("Error in pageToHtmlExecutor:", error)
    return false
  }
}
