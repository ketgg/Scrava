import {
  LaunchBrowserTask,
  PageToHtmlTask,
  ExtractTextFromElementTask,
  FillInputTask,
  ClickElementTask,
  WaitForElementTask,
  DeliverViaWebhookTask,
  ExtractDataWithAITask,
  ReadPropertyFromJSONTask,
  AddPropertyToJSONTask,
} from "./task"
import { TaskType } from "@/types/task"
import { WorkflowTask } from "@/types/workflow"

type Registry = {
  [K in TaskType]: WorkflowTask & { type: TaskType }
}

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJSONTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJSONTask,
}
