import { FillInputTask } from "@/configs/workflow/task"

import { ExecutionEnv } from "@/types/executor"

export const fillInputExecutor = async (
  environment: ExecutionEnv<typeof FillInputTask>
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector")
    if (!selector) {
      environment.log.error("Input:Selector not defined.")
    }

    const value = environment.getInput("Value")
    if (!value) {
      environment.log.error("Input:Value not defined.")
    }

    await environment.getPage()?.type(selector, value)

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    // console.error("Error in pageToHtmlExecutor:", error)
    return false
  }
}
