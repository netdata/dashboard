import { useDispatch } from "react-redux"
import { useListenToPostMessage } from "utils/post-message"
import { setUserNodeAccess } from "domains/global/actions"
import { UserNodeAccessMessage } from "domains/global/types"

const useUserNodeAccessMessage = () => {
  const dispatch = useDispatch()
  useListenToPostMessage<UserNodeAccessMessage>("user-node-access", message => {
    dispatch(setUserNodeAccess({ message }))
  })
}

export default useUserNodeAccessMessage
