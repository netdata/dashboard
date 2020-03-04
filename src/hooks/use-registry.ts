import { useEffect } from "react"

import { useDispatch, useSelector } from "store/redux-separate-context"
import { serverDefault } from "utils/server-detection"
import { fetchHelloAction } from "domains/global/actions"
import { selectRegistry } from "domains/global/selectors"

export const useRegistry = (shouldUseRegistry: boolean) => {
  const registry = useSelector(selectRegistry)

  const dispatch = useDispatch()
  useEffect(() => {
    if (shouldUseRegistry && !registry.isFetchingHello && !registry.hasFetchedHello) {
      dispatch(fetchHelloAction.request({
        serverDefault,
      }))
    }
  }, [dispatch, registry, shouldUseRegistry])
}
