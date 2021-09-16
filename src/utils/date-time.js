import { useMemo } from "react"
import moment from "moment"
import { useSelector } from "store/redux-separate-context"
import { selectTimezoneSetting, selectUTCOffsetSetting } from "domains/global/selectors"

const zeropad = x => {
  if (x > -10 && x < 10) {
    return `0${x.toString()}`
  }
  return x.toString()
}

export const isSupportingDateTimeFormat = !!(Intl && Intl.DateTimeFormat && navigator.language)

const narrowToDate = d => (typeof d === "number" ? new Date(d) : d)
// these are the old netdata functions
// we fallback to these, if the new ones fail
export const localeDateStringNative = d => narrowToDate(d).toLocaleDateString()
export const localeTimeStringNative = d => narrowToDate(d).toLocaleTimeString()
export const xAxisTimeStringNative = d => {
  const date = narrowToDate(d)
  return `${zeropad(date.getHours())}:${zeropad(date.getMinutes())}:${zeropad(date.getSeconds())}`
}

export const isProperTimezone = timeZone => {
  try {
    Intl.DateTimeFormat(navigator.language, {
      localeMatcher: "best fit",
      formatMatcher: "best fit",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone,
    })
  } catch (e) {
    return false
  }
  return true
}

export const getDateWithOffset = (date, offset) => moment(date).utcOffset(offset)

const getOptions = ({ long, isTime, secs, timezone }) => ({
  hourCycle: "h23",
  ...(isTime
    ? {}
    : long
    ? { weekday: "short", year: "numeric", month: "short", day: "2-digit" }
    : { dateStyle: "short" }),
  ...(isTime && {
    timeStyle: secs ? "medium" : "short",
  }),
  timeZone: timezone,
})

const dateFormat = (date, { locale, ...options }) =>
  new Intl.DateTimeFormat(locale ?? navigator.language, getOptions(options)).format(date)

const getTimezone = timezone => (timezone !== "" && timezone !== "default" ? timezone : undefined)

export const useDateTime = () => {
  const timezone = useSelector(selectTimezoneSetting)
  const utcOffset = useSelector(selectUTCOffsetSetting)

  const localeDateString = useMemo(() => {
    return isSupportingDateTimeFormat
      ? (date, options) =>
          dateFormat(date, { long: true, timezone: getTimezone(timezone), ...options })
      : localeDateStringNative
  }, [timezone])

  const localeTimeString = useMemo(() => {
    return isSupportingDateTimeFormat
      ? (date, options) =>
          dateFormat(date, {
            secs: true,
            isTime: true,
            timezone: getTimezone(timezone),
            ...options,
          })
      : localeTimeStringNative
  }, [timezone])

  const xAxisTimeString = useMemo(() => {
    return isSupportingDateTimeFormat
      ? date => dateFormat(date, { secs: true, isTime: true, timezone: getTimezone(timezone) })
      : xAxisTimeStringNative
  }, [timezone])

  const xAxisDateString = useMemo(() => {
    return isSupportingDateTimeFormat
      ? date => dateFormat(date, { long: true, timezone: getTimezone(timezone) })
      : xAxisTimeStringNative
  }, [timezone])

  return {
    localeDateString,
    localeTimeString,
    xAxisDateString,
    xAxisTimeString,
    utcOffset,
  }
}
