export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  PAGE_TO_HTML = "PAGE_TO_HTML",
  EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
  FILL_INPUT = "FILL_INPUT",
  CLICK_ELEMENT = "CLICK_ELEMENT",
  WAIT_FOR_ELEMENT = "WAIT_FOR_ELEMENT",
}

export enum TaskParamType {
  STRING = "STRING",
  BROWSER_INSTANCE = "BROWSER_INSTANCE",
  SELECT = "SELECT",
}

export type OptionType = {
  label: string
  value: string
}

export interface TaskParam {
  name: string
  type: TaskParamType
  helperText?: string
  required?: boolean
  hideHandle?: boolean
  value?: string
  [key: string]: any
  options?: OptionType[]
}

export interface ParamProps {
  param: TaskParam
  value: string
  updateNodeParamValue: (newValue: string) => void
  disabled?: boolean
}
