import moment from "moment"

export const SECONDS = 1000
export const MINUTE = SECONDS * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24
export const MONTH = DAY * 30

const resolutionMap = [
  { value: DAY, unit: "d" },
  { value: HOUR, unit: "h" },
  { value: MINUTE, unit: "min" },
  { value: MINUTE, unit: "min" },
  { value: SECONDS, unit: "s" },
]

export const getStartDate = start =>
  start < 0 ? moment(new Date()).add(start, "seconds") : moment(start)
export const getEndDate = end => (!end ? moment(new Date()) : moment(end))
export const getIsSameDate = (startDate, endDate) => startDate.isSame(endDate, "day")
export const getDuration = (startDate, endDate) => moment.duration(startDate.diff(endDate))

const getResolution = (value, resolution) => (value > 1 ? `${Math.floor(value)}${resolution}` : "")

export const getGranularDuration = duration => {
  let seconds = Math.abs(duration)
  const showSeconds = seconds < MINUTE
  return resolutionMap.reduce((acc, { value, unit }) => {
    if (value === SECONDS && !showSeconds) return acc
    acc = acc + getResolution(seconds / value, unit)
    seconds = seconds % value
    return acc
  }, "")
}