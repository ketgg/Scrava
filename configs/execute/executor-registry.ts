import { launchBrowserExecutor } from "./launch-browser"
import { pageToHtmlExecutor } from "./page-to-html"
import { extractTextFromElementExecutor } from "./extract-text-from-element"
import { fillInputExecutor } from "./fill-input"
import { clickElementExecutor } from "./click-element"
import { waitForElementExecutor } from "./wait-for-element"

import { TaskType } from "@/types/task"
import { WorkflowTask } from "@/types/workflow"
import { ExecutionEnv } from "@/types/executor"
import { deliverViaWebhookExecutor } from "./deliver-via-webhook"

type ExecutorFn<T extends WorkflowTask> = (
  env: ExecutionEnv<T>
) => Promise<boolean>

type RegistryType = {
  [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>
}

export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: launchBrowserExecutor,
  PAGE_TO_HTML: pageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementExecutor,
  FILL_INPUT: fillInputExecutor,
  CLICK_ELEMENT: clickElementExecutor,
  WAIT_FOR_ELEMENT: waitForElementExecutor,
  DELIVER_VIA_WEBHOOK: deliverViaWebhookExecutor,
}
