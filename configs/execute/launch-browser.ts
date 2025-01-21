import puppeteer from "puppeteer"
import { ExecutionEnv } from "@/types/executor"
import { LaunchBrowserTask } from "@/configs/workflow/task"

export const launchBrowserExecutor = async (
  environment: ExecutionEnv<typeof LaunchBrowserTask>
): Promise<boolean> => {
  try {
    const websiteUrl = environment.getInput("Website URL")

    // Open the browser in background
    const browser = await puppeteer.launch({ headless: true })
    environment.log.info(
      `Browser launched successfully: ${await browser.version()}`
    )
    environment.setBrowser(browser)

    const page = await browser.newPage()
    await page.goto(websiteUrl)

    // Our scraper will only work on single page
    environment.setPage(page)
    environment.log.info(`Navigated to ${websiteUrl}`)

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
