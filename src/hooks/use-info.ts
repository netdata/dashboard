import { useEffect } from "react"
import { useDispatch, useSelector } from "store/redux-separate-context"
import { fetchInfoAction } from "domains/chart/actions"
import { selectRegistry } from "domains/global/selectors"

export const useInfo = (shouldUseInfo: boolean) => {
  const { hasStartedInfo } = useSelector(selectRegistry)
  const dispatch = useDispatch()
  useEffect(() => {
    if (shouldUseInfo && !hasStartedInfo) {
      dispatch(fetchInfoAction.request({
        poll: true,
      }))
    }
  }, [dispatch, hasStartedInfo, shouldUseInfo])
}
