import puppeteer from "puppeteer"
import { ExecutionEnv } from "@/types/executor"
import { LaunchBrowserTask } from "@/configs/workflow/task"

const proxyServerUrl = process.env.PROXY_URL as string
const proxyUsername = process.env.PROXY_USERNAME as string
const proxyPassword = process.env.PROXY_PASSWORD as string

export const launchBrowserExecutor = async (
  environment: ExecutionEnv<typeof LaunchBrowserTask>
): Promise<boolean> => {
  try {
    const websiteUrl = environment.getInput("Website URL")
    let browser
    // Open the browser in background
    // TODO - Use BrightData's scraping browser instead
    if (proxyServerUrl && proxyPassword && proxyUsername) {
      browser = await puppeteer.launch({
        headless: true,

        args: [`--proxy-server=${proxyServerUrl}`],
      })
    } else {
      browser = await puppeteer.launch({
        headless: true,
      })
    }

    environment.log.info(
      `Browser launched successfully: ${await browser.version()}`
    )
    environment.setBrowser(browser)

    const page = await browser.newPage()

    if (proxyServerUrl && proxyPassword && proxyUsername) {
      await page.authenticate({
        username: proxyUsername,
        password: proxyPassword,
      })
    }

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
