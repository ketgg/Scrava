import {
  CodeIcon,
  GlobeIcon,
  TextIcon,
  LucideProps,
  Edit3,
  MousePointerClick,
  Eye,
  Send,
  Brain,
  File,
  Database,
} from "lucide-react"

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
  ] as const,
  outputs: [
    {
      name: "Webpage",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
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
  ] as const,
  outputs: [
    { name: "HTML", type: TaskParamType.STRING },
    {
      name: "Webpage",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
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
  ] as const,
  outputs: [
    {
      name: "Extracted Text",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask

export const FillInputTask = {
  type: TaskType.FILL_INPUT,

  label: "Fill Input",
  icon: (props) => <Edit3 className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Webpage",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Value",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Webpage", // Updated webpage after the input has been filled
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
} satisfies WorkflowTask

export const ClickElementTask = {
  type: TaskType.CLICK_ELEMENT,

  label: "Click Element",
  icon: (props) => (
    <MousePointerClick className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Webpage",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Webpage", // Updated webpage after the element has been clicked
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
} satisfies WorkflowTask

export const WaitForElementTask = {
  type: TaskType.WAIT_FOR_ELEMENT,

  label: "Wait For Element",
  icon: (props) => <Eye className="stroke-blue-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Webpage",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Visibility",
      type: TaskParamType.SELECT,
      required: true,
      hideHandle: true,
      options: [
        { label: "Visible", value: "visible" },
        { label: "Hidden", value: "hidden" },
      ],
    },
  ] as const,
  outputs: [
    {
      name: "Webpage", // Updated webpage after the element has been clicked
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
} satisfies WorkflowTask

export const DeliverViaWebhookTask = {
  type: TaskType.DELIVER_VIA_WEBHOOK,

  label: "Deliver Via Webhook",
  icon: (props) => <Send className="stroke-emerald-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Target URL",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Body",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [] as const, // TODO - Add the response status
} satisfies WorkflowTask

export const ExtractDataWithAITask = {
  type: TaskType.EXTRACT_DATA_WITH_AI,

  label: "Extract Data With AI",
  icon: (props) => <Brain className="stroke-rose-400" {...props} />,
  isEntryPoint: false,
  credits: 4,
  inputs: [
    {
      name: "Content",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
      name: "Prompt",
      type: TaskParamType.STRING,
      variant: "textarea",
      required: true,
    },
  ] as const,
  outputs: [{ name: "Extracted Data", type: TaskParamType.STRING }] as const,
} satisfies WorkflowTask

export const ReadPropertyFromJSONTask = {
  type: TaskType.READ_PROPERTY_FROM_JSON,

  label: "Read Property From JSON",
  icon: (props) => <File className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 4,
  inputs: [
    {
      name: "JSON",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Property Name",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Property Value",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask

export const AddPropertyToJSONTask = {
  type: TaskType.ADD_PROPERTY_TO_JSON,

  label: "Add Property To JSON",
  icon: (props) => <Database className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 4,
  inputs: [
    {
      name: "JSON",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Property Name",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Property Value",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Updated JSON",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask
