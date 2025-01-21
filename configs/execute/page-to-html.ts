import { PageToHtmlTask } from "@/configs/workflow/task"

import { ExecutionEnv } from "@/types/executor"

export const pageToHtmlExecutor = async (
  environment: ExecutionEnv<typeof PageToHtmlTask>
): Promise<boolean> => {
  try {
    const html = await environment.getPage()!.content()
    // console.log("@PAGE HTML", html)

    environment.setOutput("HTML", html)

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    // console.error("Error in pageToHtmlExecutor:", error)
    return false
  }
}
