import * as cheerio from "cheerio"
import { ExecutionEnv } from "@/types/executor"
import { ExtractTextFromElementTask } from "@/configs/workflow/task"

export const extractTextFromElementExecutor = async (
  environment: ExecutionEnv<typeof ExtractTextFromElementTask>
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Element Selector")
    if (!selector) {
      environment.log.error("Element Selector is not provided")
      return false
    } // Should never happen, as already checked in workflow validation

    const html = environment.getInput("HTML")
    if (!html) {
      environment.log.error("HTML is not provided")
      return false
    } // Should never happen, as already checked in workflow validation

    const $ = cheerio.load(html)
    const element = $(selector)
    if (!element) {
      environment.log.error("Element corresponding to the Selector not found")
      // console.error("Element not found in extractTextFromElementExecutor")
      return false
    }

    const extractedText = $.text(element)
    if (!extractedText) {
      environment.log.error("Element has no text")
      // console.error("Element has no text in extractTextFromElementExecutor")
      return false
    }

    environment.setOutput("Extracted Text", extractedText)

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    // console.error("Error in extractTextFromElementExecutor:", error)
    return false
  }
}
