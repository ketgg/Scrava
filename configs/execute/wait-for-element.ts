import { WaitForElementTask } from "@/configs/workflow/task"

import { ExecutionEnv } from "@/types/executor"
import { env } from "process"

export const waitForElementExecutor = async (
  environment: ExecutionEnv<typeof WaitForElementTask>
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector")
    if (!selector) {
      environment.log.error("Input:Selector not defined.")
    }

    const visibility = environment.getInput("Visibility")
    if (!visibility) {
      environment.log.error("Input:Visibility not defined.")
    }

    // TODO - Add seperate enum for the "visible", "hidden"
    // TODO - Add custom input delay to wait for
    // By default its 30secs
    await environment.getPage()?.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
    })

    environment.log.info(`Element ${selector} became: ${visibility}`)

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    // console.error("Error in pageToHtmlExecutor:", error)
    return false
  }
}
