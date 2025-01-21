import {
  LaunchBrowserTask,
  PageToHtmlTask,
  ExtractTextFromElementTask,
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
}
