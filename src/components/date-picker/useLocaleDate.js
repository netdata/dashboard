import { useDateTime } from "@/src/utils/date-time"
import { useCallback } from "react"

const useLocaleDate = () => {
  const { localeTimeString, localeDateString } = useDateTime()
  return useCallback(
    date => {
      return `${localeDateString(date, { locale: "en-us", long: false })} ${localeTimeString(date, {
        secs: false,
      })}`
    },
    [localeTimeString, localeDateString]
  )
}

export default useLocaleDate
