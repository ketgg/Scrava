import { Log, LogCollector, LogFn, LogLevel, LogLevels } from "@/types/log"

export const createLogCollector = (): LogCollector => {
  const logs: Log[] = []
  const getAll = () => logs

  const logFunctions = {} as Record<LogLevel, LogFn>
  LogLevels.forEach(
    (level) =>
      (logFunctions[level] = (message: string) => {
        logs.push({ message, level, timestamp: new Date() })
      })
  )

  return {
    getAll,
    ...logFunctions,
  }
}
