import { ClickElementTask } from "@/configs/workflow/task"

import { ExecutionEnv } from "@/types/executor"

export const clickElementExecutor = async (
  environment: ExecutionEnv<typeof ClickElementTask>
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector")
    if (!selector) {
      environment.log.error("Input:Selector not defined.")
    }

    // TODO: Here in click we can specify which buttons to be clicked
    // We can extend this for left, right, middle clicks...
    await environment.getPage()?.click(selector)

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    // console.error("Error in pageToHtmlExecutor:", error)
    return false
  }
}
