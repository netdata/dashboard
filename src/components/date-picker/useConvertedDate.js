import { useMemo } from "react"
import { toDate } from "date-fns"

const convertTimestampToDate = timestamp => {
  if (timestamp > 0) {
    return toDate(timestamp)
  } else if (timestamp || timestamp === 0) return toDate(new Date().valueOf() + timestamp * 1000)
  return null
}

const useConvertedDates = (startDate, endDate) => {
  return useMemo(() => [convertTimestampToDate(startDate), convertTimestampToDate(endDate)], [
    startDate,
    endDate,
  ])
}

export default useConvertedDates
