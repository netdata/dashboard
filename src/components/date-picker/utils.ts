import { DateResolution } from "./types"

export const MINUTE = 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24
export const MONTH = DAY * 30

type GuessResolutionAndValue = (after: number) => { resolution: DateResolution; value: number }

export const guessResolutionAndValue: GuessResolutionAndValue = (after: number) => {
  let resolution: DateResolution
  let value: number
  if (after >= MONTH) {
    resolution = "month"
    value = Math.round(after / MONTH)
  } else if (after >= DAY) {
    resolution = "day"
    value = Math.round(after / DAY)
  } else if (after >= HOUR) {
    resolution = "hour"
    value = Math.round(after / HOUR)
  } else {
    resolution = "minute"
    value = Math.round(after / MINUTE)
  }
  return {
    resolution,
    value,
  }
}

export const getShortHandTimeAlias = (after: number) => {
  const { value, resolution } = guessResolutionAndValue(after)
  if (value > 1) {
    return `Last ${value} ${resolution}s`
  }
  return `Last ${resolution}`
}
