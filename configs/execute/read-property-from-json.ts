import { ReadPropertyFromJSONTask } from "@/configs/workflow/task"

import { ExecutionEnv } from "@/types/executor"

export const readPropertyFromJSONExecutor = async (
  environment: ExecutionEnv<typeof ReadPropertyFromJSONTask>
): Promise<boolean> => {
  try {
    const jsonData = environment.getInput("JSON")
    if (!jsonData) {
      environment.log.error("Input:JSON not defined.")
    }

    const propertyName = environment.getInput("Property Name")
    if (!propertyName) {
      environment.log.error("Input:Property Name not defined.")
    }

    const parsedJSON = JSON.parse(jsonData)
    const propertyVal = parsedJSON[propertyName]
    if (propertyVal === undefined) {
      environment.log.error("Property not found!")
      return false
    }

    environment.setOutput("Property Value", propertyVal)

    return true
  } catch (error: any) {
    environment.log.error(error.message)

    return false
  }
}
