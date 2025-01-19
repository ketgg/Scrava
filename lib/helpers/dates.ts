import { intervalToDuration } from "date-fns"

export const datesToDurationString = (
  startDate: Date | null | undefined,
  endDate: Date | null | undefined
) => {
  if (!startDate || !endDate) return null
  const start = new Date(startDate)
  const end = new Date(endDate)
  const timeElapsed = end.getTime() - start.getTime()
  if (timeElapsed < 1000) {
    // Less than 1 sec
    return `${timeElapsed}ms`
  }
  const duration = intervalToDuration({ start: 0, end: timeElapsed })

  // Not using hours because I don't think any workflow will last for hours
  return `${duration.minutes || 0}m ${duration.seconds || 0}s`
}
