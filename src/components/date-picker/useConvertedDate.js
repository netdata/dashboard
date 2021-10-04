import { useMemo } from "react"
import { toDate } from "date-fns"
import useLocaleDate from "./useLocaleDate"

export const convertTimestampToDate = (timestamp, getLocaleDate) => {
  if (timestamp > 0) {
    return toDate(new Date(getLocaleDate(timestamp)))
  } else if (timestamp || timestamp === 0)
    return toDate(new Date(getLocaleDate(new Date().valueOf() + timestamp * 1000)))
  return null
}

const useConvertedDates = (startDate, endDate) => {
  const getLocaleDate = useLocaleDate()
  return useMemo(
    () => [
      convertTimestampToDate(startDate, getLocaleDate),
      convertTimestampToDate(endDate, getLocaleDate),
    ],
    [startDate, endDate, getLocaleDate]
  )
}

export default useConvertedDates
