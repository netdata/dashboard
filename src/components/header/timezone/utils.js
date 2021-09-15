import { timezones } from "./timezones"

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
  return timezones.reduce((acc, timezone) => {
    const { utc } = timezone

    try {
      // We use 'fr' locale because it is the only one that returns back the UTC offset (dd/mm/yyyy, UTC-x) 
      // so we can parse it later and digitize it.
      const dateString = new Intl.DateTimeFormat("fr", {
        timeZone: utc[0],
        timeZoneName: "short",
      }).format(now)

      const [parsedOffset] = dateString.match(/[−+].+/) || []
      const normalizedOffset = normalizeOffset(parsedOffset)

      if (memoized[normalizedOffset])
        return acc.concat({ ...timezone, offset: memoized[normalizedOffset] })

      const digitizedOffset = digitizeOffset(normalizedOffset)

      memoized[normalizedOffset] = digitizedOffset
      return acc.concat({ ...timezone, offset: digitizedOffset })
    } catch (e) {
      return acc
    }
  }, [])
}

export const timezonesById = timezones =>
  timezones.reduce((acc, { utc, ...timezone }) => {
    utc.forEach(item => (acc[item] = { ...timezone, utc: item }))
    return acc
  }, {})

export const getDefaultTimezone = () => {
  const dateFormat = new Intl.DateTimeFormat("default", {})
  const usedOptions = dateFormat.resolvedOptions()
  return usedOptions
}
