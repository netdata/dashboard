import { timezones } from "./timezones2"

const digitizeOffset = parsedOffset => {
  if (!parsedOffset) return "+0"
  const splitOffset = parsedOffset.split(":")
  return splitOffset.length > 1
    ? `${splitOffset[0]}${(splitOffset[1] / 60).toString().substr(1)}`
    : splitOffset[0]
}

const normalizeOffset = parsedOffset => (parsedOffset ? parsedOffset.replace("−", "-") : "")

const now = new Date()
export const timezoneList = () => {
  const memoized = {}
  return timezones.map(timezone => {
    const { utc } = timezone

    const dateString = new Intl.DateTimeFormat("fr", {
      timeZone: utc[0],
      timeZoneName: "short",
    }).format(now)

    const [parsedOffset] = dateString.match(/[−+].+/) || []
    const normalizedOffset = normalizeOffset(parsedOffset)

    if (memoized[normalizedOffset]) return { ...timezone, offset: memoized[normalizedOffset] }

    const digitizedOffset = digitizeOffset(normalizedOffset)

    memoized[normalizedOffset] = digitizedOffset
    return { ...timezone, offset: digitizedOffset }
  })
}

export const getDefaultTimezone = () => {
  const dateFormat = new Intl.DateTimeFormat("default", {})
  const usedOptions = dateFormat.resolvedOptions()
  console.log(usedOptions)
  return usedOptions;
}
