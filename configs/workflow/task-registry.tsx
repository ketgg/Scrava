import {
  LaunchBrowserTask,
  PageToHtmlTask,
  ExtractTextFromElementTask,
} from "./task"

export const TaskRegistry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
}
