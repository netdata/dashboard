import { useEffect } from "react"
import { useDispatch, useSelector } from "store/redux-separate-context"
import { fetchInfoAction } from "domains/chart/actions"
import { selectRegistry } from "domains/global/selectors"

export const useInfo = (shouldUseInfo: boolean) => {
  const registry = useSelector(selectRegistry)
  const hasStartedInfo = registry?.hasStartedInfo || false
  const dispatch = useDispatch()
  useEffect(() => {
    if (shouldUseInfo && !hasStartedInfo) {
      dispatch(fetchInfoAction.request({
        poll: false,
      }))
    }
  }, [dispatch, hasStartedInfo, shouldUseInfo])
}
