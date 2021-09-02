import { format, formatDistanceStrict, getTime, getUnixTime, add } from "date-fns"

const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const MONTH = 30 * DAY

export const dateResolutions = ["minutes", "hours", "days", "months"]

export const getCustomTimePeriod = after => {
  let resolution
  let value

  if (after <= HOUR) {
    resolution = "minutes"
    value = Math.round(after / MINUTE)
  } else if (after <= DAY) {
    resolution = "hours"
    value = Math.round(after / HOUR)
  } else if (after <= MONTH) {
    resolution = "days"
    value = Math.round(after / DAY)
  } else {
    resolution = "months"
    value = Math.round(after / MONTH)
  }

  return {
    resolution,
    value,
  }
}

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
  { period: "Last 5 minutes", value: -5 * MINUTE },
  { period: "Last 15 minutes", value: -15 * MINUTE },
  { period: "Last 30 minutes", value: -30 * MINUTE },
  { period: "Last 2 hours", value: -2 * HOUR },
  { period: "Last 6 hours", value: -6 * HOUR },
  { period: "Last 12 hours", value: -12 * HOUR },
  { period: "Last Day", value: -DAY },
  { period: "Last 2 Days", value: -2 * DAY },
  { period: "Last 7 Days", value: -7 * DAY },
]

export const formatDates = (startDate, endDate) => {
  const formattedStartDate = format(startDate, "MMMM d yyyy, H:mm:ss")
  const formattedEndDate = format(endDate, "MMMM d yyyy, H:mm:ss")
  return {
    formattedStartDate,
    formattedEndDate,
  }
}

export const getTimePeriod = (startDate, endDate) =>
  formatDistanceStrict(getTime(startDate), getTime(endDate))
