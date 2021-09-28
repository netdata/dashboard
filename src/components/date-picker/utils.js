import { format, formatDistanceStrict, parse, getTime, getUnixTime, add, isMatch } from "date-fns"

const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const MONTH = 30 * DAY

export const maxTimePeriodInUnix = 94694400
export const dateResolutions = ["minutes", "hours", "days", "months"]

const resolutionsMapping = {
  minutes: MINUTE,
  hours: HOUR,
  days: DAY,
  months: MONTH,
}

export const getCustomTimePeriod = (after, resolution) =>
  Math.round(after / resolutionsMapping[resolution])

export const parseInputPeriod = (timeCorrection, resolution) => {
  const customRange = add(new Date(0), {
    [resolution]: timeCorrection,
  })
  return -getUnixTime(customRange)
}

const focusTaggingMap = {
  startDate: "start",
  endDate: "finish",
}

export const getFocusTagging = focusedInput => focusTaggingMap[focusedInput]

export const timePeriods = [
  { period: "Last 5 minutes", value: -5 * MINUTE, resolution: "minutes" },
  { period: "Last 15 minutes", value: -15 * MINUTE, resolution: "minutes" },
  { period: "Last 30 minutes", value: -30 * MINUTE, resolution: "minutes" },
  { period: "Last 2 hours", value: -2 * HOUR, resolution: "hours" },
  { period: "Last 6 hours", value: -6 * HOUR, resolution: "hours" },
  { period: "Last 12 hours", value: -12 * HOUR, resolution: "hours" },
  { period: "Last Day", value: -DAY, resolution: "days" },
  { period: "Last 2 Days", value: -2 * DAY, resolution: "days" },
  { period: "Last 7 Days", value: -7 * DAY, resolution: "days" },
]

export const formatDates = (startDate, endDate) => {
  const formattedStartDate = format(startDate, "MMMM d yyyy, H:mm:ss")
  const formattedEndDate = format(endDate, "MMMM d yyyy, H:mm:ss")
  return {
    formattedStartDate,
    formattedEndDate,
  }
}

export const formatOffset = offset => {
  if (!offset) return "+00:00"
  const splitOffset = offset.toString().split(".")
  const mathSign = splitOffset[0] > 0 ? "+" : "-"
  const absoluteNumber = Math.abs(splitOffset[0]).toString()
  const firstPart = `${mathSign}${absoluteNumber.padStart(2, 0)}`
  return splitOffset.length > 1
    ? `${firstPart}:${String(splitOffset[1] * 0.6).padEnd(2, 0)}`
    : `${firstPart}:00`
}

export const getDateWithOffset = (date, utcOffset) => {
  const formattedDate = isMatch(date, "MMMM d yyyy, H:mm")
    ? date
    : parse(date, "MMMM d yyyy, H:mm", Date.now())
  return parse(`${formattedDate} ${formatOffset(utcOffset)}`, "MMMM d yyyy, H:mm xxx", Date.now())
}

export const getTimePeriod = (startDate, endDate) =>
  formatDistanceStrict(getTime(startDate), getTime(endDate))
