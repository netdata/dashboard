import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { serverDefault } from "utils/server-detection"
import { fetchHelloAction } from "domains/global/actions"
import { selectIsFetchingHello } from "domains/global/selectors"

export const useRegistry = (shouldUseRegistry: boolean) => {
  const isFetchingHello = useSelector(selectIsFetchingHello)

  const dispatch = useDispatch()
  useEffect(() => {
    if (shouldUseRegistry && !isFetchingHello) {
      dispatch(fetchHelloAction.request({
        serverDefault,
      }))
    }
  }, [dispatch, isFetchingHello, shouldUseRegistry])
}
