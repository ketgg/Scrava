import { ScrollToElementTask } from "@/configs/workflow/task"

import { ExecutionEnv } from "@/types/executor"

export const scrollToElementExecutor = async (
  environment: ExecutionEnv<typeof ScrollToElementTask>
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector")
    if (!selector) {
      environment.log.error("Input:Selector not defined.")
    }

    // Execute JS on page using evaluate
    await environment.getPage()?.evaluate((selector) => {
      const element = document.querySelector(selector)
      if (!element) {
        throw new Error("Element not found.")
      }
      const yPos = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: yPos })
    }, selector)

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    // console.error("Error in pageToHtmlExecutor:", error)
    return false
  }
}
