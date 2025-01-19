import { CodeIcon, GlobeIcon, TextIcon, LucideProps } from "lucide-react"

import { TaskType, TaskParamType } from "@/types/task"
import { WorkflowTask } from "@/types/workflow"

export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,

  label: "Launch Browser",
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: true,
  credits: 5,
  inputs: [
    {
      name: "Website URL",
      type: TaskParamType.STRING,
      helperText: "e.g. https://toscrape.com/",
      required: true,
      hideHandle: true, // As this is the entry point, we don't need a handle
    },
  ],
  outputs: [
    {
      name: "Webpage",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ],
} satisfies WorkflowTask

export const PageToHtmlTask = {
  type: TaskType.PAGE_TO_HTML,

  label: "Get HTML from page",
  icon: (props: LucideProps) => (
    <CodeIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Webpage",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
  ],
  outputs: [
    { name: "HTML", type: TaskParamType.STRING },
    {
      name: "Webpage",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ],
} satisfies WorkflowTask

export const ExtractTextFromElementTask = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract Text from Element",
  icon: (props: LucideProps) => (
    <TextIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "HTML",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Element Selector",
      type: TaskParamType.STRING,
      required: true,
    },
  ],
  outputs: [{ name: "Extracted Text", type: TaskParamType.STRING }],
} satisfies WorkflowTask
