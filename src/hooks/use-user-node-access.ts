import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { sendToChildIframe, useListenToPostMessage } from "utils/post-message"
import { setUserNodeAccess } from "domains/global/actions"
import { UserNodeAccessMessage } from "domains/global/types"
import { SIGN_IN_IFRAME_ID } from "components/header/constants"

const useUserNodeAccessMessage = () => {
  const dispatch = useDispatch()
  useListenToPostMessage<UserNodeAccessMessage>("user-node-access", message => {
    dispatch(setUserNodeAccess({ message }))
  })
}

export const useRequestRefreshOfAccessMessage = () => {
  return useCallback(() => {
    sendToChildIframe(SIGN_IN_IFRAME_ID, { type: "request-refresh-access", payload: true })
  }, [])
}

export default useUserNodeAccessMessage
