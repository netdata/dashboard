import { useEffect, useState } from "react"
import { useInterval } from "react-use"

import { useSelector } from "store/redux-separate-context"
import {
  selectHasWindowFocus,
  selectStopUpdatesWhenFocusIsLost,
  selectGlobalPause,
} from "domains/global/selectors"
import { BIGGEST_INTERVAL_NUMBER } from "utils/biggest-interval-number"
import { isPrintMode } from "domains/dashboard/utils/parse-url"

type UseFetchNewDataClock = (arg: {
  areCriteriaMet: boolean
  preferedIntervalTime: number
}) => [boolean, (shouldFetch: boolean) => void]
export const useFetchNewDataClock: UseFetchNewDataClock = ({
  areCriteriaMet,
  preferedIntervalTime,
}) => {
  const hasWindowFocus = useSelector(selectHasWindowFocus)
  const stopUpdatesWhenFocusIsLost = useSelector(selectStopUpdatesWhenFocusIsLost)
  const globalPause = useSelector(selectGlobalPause)

  const shouldBeUpdating = !(!hasWindowFocus && stopUpdatesWhenFocusIsLost) && !globalPause

  const [shouldFetch, setShouldFetch] = useState<boolean>(true)
  const [shouldFetchImmediatelyAfterFocus, setShouldFetchImmediatelyAfterFocus] = useState(false)

  useEffect(() => {
    if (shouldFetchImmediatelyAfterFocus && shouldBeUpdating) {
      setShouldFetchImmediatelyAfterFocus(false)
      setShouldFetch(true)
    }
  }, [shouldFetchImmediatelyAfterFocus, setShouldFetchImmediatelyAfterFocus, shouldBeUpdating])

  // don't use setInterval when we loose focus
  const intervalTime =
    (shouldBeUpdating || !shouldFetchImmediatelyAfterFocus) && !isPrintMode
      ? preferedIntervalTime
      : BIGGEST_INTERVAL_NUMBER
  useInterval(() => {
    if (areCriteriaMet) {
      if (!shouldBeUpdating) {
        setShouldFetchImmediatelyAfterFocus(true)
        return
      }
      setShouldFetch(true)
    }
    // when there's no focus, don't ask for updated data
  }, intervalTime)
  return [shouldFetch, setShouldFetch]
}
