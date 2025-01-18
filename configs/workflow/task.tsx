import { GlobeIcon, LucideProps } from "lucide-react"

import { TaskType, TaskParamType } from "@/types/task"

export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,

  label: "Launch Browser",
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: true,
  inputs: [
    {
      name: "Website URL",
      type: TaskParamType.STRING,
      helperText: "e.g. https://toscrape.com/",
      required: true,
      hideHandle: false, // As this is the entry point, we don't need a handle
    },
  ],
}
