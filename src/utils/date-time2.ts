import moment from "moment"
import { useMemo } from "react"
import { useSelector } from "store/redux-separate-context"
import { selectUTCOffsetSetting } from "domains/global/selectors"

const zeropad = (x: number) => {
  if (x > -10 && x < 10) {
    return `0${x.toString()}`
  }
  return x.toString()
}

export const isSupportingDateTimeFormat = !!(Intl && Intl.DateTimeFormat && navigator.language)

const locale = navigator.language || "en"
moment.locale(locale)

const narrowToDate = (d: Date | number) => (typeof d === "number" ? new Date(d) : d)
// these are the old netdata functions
// we fallback to these, if the new ones fail
export const localeDateStringNative = (d: Date | number) => narrowToDate(d).toLocaleDateString()
export const localeTimeStringNative = (d: Date | number) => narrowToDate(d).toLocaleTimeString()
export const xAxisTimeStringNative = (d: Date | number) => {
  const date = narrowToDate(d)
  return `${zeropad(date.getHours())}:${zeropad(date.getMinutes())}:${zeropad(date.getSeconds())}`
}

export const isProperTimezone = (timeZone: string): boolean => {
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

export const useDateTime = () => {
  const utcOffset = useSelector(selectUTCOffsetSetting)

  const localeDateString = useMemo(
    () =>
      isSupportingDateTimeFormat
        ? (date, long = true) =>
            getDateWithOffset(date, utcOffset).format(long ? "ddd, MMM DD, YYYY" : "L")
        : localeDateStringNative,
    [utcOffset]
  )

  const localeTimeString = useMemo(
    () =>
      isSupportingDateTimeFormat
        ? (date, showSecs = true) =>
            getDateWithOffset(date, utcOffset).format(showSecs ? "HH:mm:ss" : "HH:mm")
        : localeTimeStringNative,
    [utcOffset]
  )

  const xAxisDateString = useMemo(
    () =>
      isSupportingDateTimeFormat
        ? date => getDateWithOffset(date, utcOffset).format()
        : xAxisTimeStringNative,
    [utcOffset]
  )

  const xAxisTimeString = useMemo(
    () =>
      isSupportingDateTimeFormat
        ? date => getDateWithOffset(date, utcOffset).format("HH:mm:ss")
        : xAxisTimeStringNative,
    [utcOffset]
  )

  return {
    localeDateString,
    localeTimeString,
    xAxisDateString,
    xAxisTimeString,
  }
}
