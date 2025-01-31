import { AddPropertyToJSONTask } from "@/configs/workflow/task"

import { ExecutionEnv } from "@/types/executor"

export const addPropertyToJSONExecutor = async (
  environment: ExecutionEnv<typeof AddPropertyToJSONTask>
): Promise<boolean> => {
  try {
    const jsonData = environment.getInput("JSON")
    if (!jsonData) {
      environment.log.error("Input:JSON is not defined.")
    }

    const propertyName = environment.getInput("Property Name")
    if (!propertyName) {
      environment.log.error("Input:PropertyName is not defined.")
    }

    const propertyVal = environment.getInput("Property Value")
    if (!propertyVal) {
      environment.log.error("Input:Property Value is not defined.")
    }

    const json = JSON.parse(jsonData)
    json[propertyName] = propertyVal

    environment.setOutput("Updated JSON", JSON.stringify(json))

    return true
  } catch (error: any) {
    environment.log.error(error.message)

    return false
  }
}
