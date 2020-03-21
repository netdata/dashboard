import { useDispatch } from "store/redux-separate-context"
import { useListenToPostMessage } from "utils/post-message"
import { windowFocusChangeAction } from "domains/global/actions"

interface FocusMessagePayload {
  // optional, to prevent errors on different meesages
  hasWindowFocus?: boolean
}

export const useListenToFocusMessages = () => {
  const dispatch = useDispatch()
  useListenToPostMessage("iframe-focus-change", (payload: FocusMessagePayload) => {
    const hasWindowFocus = payload?.hasWindowFocus
    if (hasWindowFocus === true) {
      dispatch(windowFocusChangeAction({ hasWindowFocus: true }))
    } else if (hasWindowFocus === false) {
      dispatch(windowFocusChangeAction({ hasWindowFocus: false }))
    }
  })
}
