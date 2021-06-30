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

const getDateWithOffset = (date, offset) => moment(date).utcOffset(offset)

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

// export const useDateTime = () => {
//   const timezone = useSelector(selectTimezoneSetting)
//   const utcOffset = useSelector(selectUTCOffsetSetting)

//   const isUsingTimezone = timezone !== "" && timezone !== "default"

//   const localeDateString = useMemo(() => {
//     const dateOptions = {
//       localeMatcher: "best fit",
//       formatMatcher: "best fit",
//       weekday: "short",
//       year: "numeric",
//       month: "short",
//       day: "2-digit",
//       timeZone: isUsingTimezone ? timezone : undefined,
//     }
//     const dateFormat = () => new Intl.DateTimeFormat(navigator.language, dateOptions)
//     //@ts-ignore
//     //@ts-nocheck
//     const theDate = d => moment(d).utcOffset(utcOffset)
//     //@ts-nocheck
//     //@ts-ignore
//     return isSupportingDateTimeFormat
//       ? (d: any, l: boolean = true) => theDate(d).format(l ? "ddd, MMM DD, YYYY" : "L")
//       : localeDateStringNative
//   }, [timezone, isUsingTimezone, utcOffset])

//   const localeTimeString = useMemo(() => {
//     const timeOptions = {
//       localeMatcher: "best fit",
//       hour12: false,
//       formatMatcher: "best fit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       // timeZone: isUsingTimezone ? timezone : undefined,
//       // timeZoneName: isUsingTimezone ? "short" : undefined,
//     }
//     const timeFormat = () => new Intl.DateTimeFormat(navigator.language, timeOptions)
//     //@ts-nocheck
//     //@ts-ignore
//     const theDate = d => {
//       const date = moment(d).utcOffset(utcOffset)
//       const toRet = date
//       return toRet
//     }
//     //@ts-nocheck
//     //@ts-ignore
//     return isSupportingDateTimeFormat
//       ? (d: any, sec: boolean = true) => theDate(d).format(sec ? "HH:mm:ss" : "HH:mm")
//       : localeTimeStringNative
//   }, [timezone, isUsingTimezone, utcOffset])

//   const xAxisTimeString = useMemo(() => {
//     const xAxisOptions = {
//       localeMatcher: "best fit",
//       hour12: false,
//       formatMatcher: "best fit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       timeZone: isUsingTimezone ? timezone : undefined,
//     }
//     // const xAxisFormat = () => new Intl.DateTimeFormat(navigator.language, xAxisOptions)
//     return isSupportingDateTimeFormat
//       ? (d: any) => moment(d).utcOffset(utcOffset).format("HH:mm:ss")
//       : xAxisTimeStringNative
//   }, [timezone, isUsingTimezone, utcOffset])

//   const xAxisDateString = useMemo(() => {
//     const xAxisOptions = {
//       localeMatcher: "best fit",
//       hour12: false,
//       formatMatcher: "best fit",
//       day: "2-digit",
//       month: "2-digit",
//       timeZone: isUsingTimezone ? timezone : undefined,
//     }
//     const xAxisFormat = () => new Intl.DateTimeFormat(navigator.language, xAxisOptions)
//     return isSupportingDateTimeFormat
//       ? (d: any) => moment(d).utcOffset(utcOffset).format()
//       : xAxisTimeStringNative
//   }, [timezone, isUsingTimezone, utcOffset])

//   return {
//     localeDateString,
//     localeTimeString,
//     xAxisDateString,
//     xAxisTimeString,
//   }
// }
