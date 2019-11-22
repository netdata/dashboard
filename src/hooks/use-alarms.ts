import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { startAlarmsAction } from "domains/global/actions"
import { selectHasStartedAlarms } from "domains/global/selectors"
import { serverDefault } from "utils/server-detection"

export const useAlarms = (shouldUseAlarms: boolean) => {
  const hasStartedAlarms = useSelector(selectHasStartedAlarms)

  const dispatch = useDispatch()
  useEffect(() => {
    if (shouldUseAlarms && !hasStartedAlarms) {
      dispatch(startAlarmsAction({
        serverDefault,
      }))
    }
  }, [dispatch, hasStartedAlarms, shouldUseAlarms])
}
