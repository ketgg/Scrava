import { TaskParamType } from "@/types/task"

export const HANDLE_SIZE = "!w-3 !h-3"

export const HANDLE_BORDER = "!border-1 !border-background"

export const HANDLE_COLORS: Record<TaskParamType, string> = {
  [TaskParamType.BROWSER_INSTANCE]: "!bg-cyan-400",
  [TaskParamType.STRING]: "!bg-orange-400",
  // [TaskParamType.NUMBER]: "bg-muted-foreground",
  // [TaskParamType.BOOLEAN]: "bg-muted-foreground",
  [TaskParamType.SELECT]: "!bg-rose-400",
}
