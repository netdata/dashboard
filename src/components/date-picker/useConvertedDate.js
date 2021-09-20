import { useCallback, useMemo } from "react"
import { toDate } from "date-fns"
import { useDateTime } from "@/src/utils/date-time"

export const convertTimestampToDate = (timestamp, getLocaleDate) => {
  if (timestamp > 0) {
    return toDate(new Date(getLocaleDate(timestamp)))
  } else if (timestamp || timestamp === 0)
    return toDate(new Date(getLocaleDate(new Date().valueOf() + timestamp * 1000)))
  return null
}

const useConvertedDates = (startDate, endDate) => {
  const { localeTimeString, localeDateString } = useDateTime()
  const getLocaleDate = useCallback(
    date => {
      return `${localeDateString(date, { locale: "en-us", long: false })} ${localeTimeString(date, {
        secs: false,
      })}`
    },
    [localeTimeString, localeDateString]
  )

  return useMemo(
    () => [
      convertTimestampToDate(startDate, getLocaleDate),
      convertTimestampToDate(endDate, getLocaleDate),
    ],
    [startDate, endDate]
  )
}

export default useConvertedDates
