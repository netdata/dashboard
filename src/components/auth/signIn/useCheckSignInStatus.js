import { useCallback, useState } from "react"
import { useLocalStorage } from "react-use"
import { useDispatch } from "react-redux"
import { useListenToPostMessage } from "@/src/utils/post-message"
import { isSignedInAction } from "@/src/domains/dashboard/actions"

const useCheckSignInStatus = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useLocalStorage("has-sign-in-history")
  const [hasSignedInBefore, setHasSignedInBefore] = useState(value)

  const onMessage = useCallback(isNew => {
    if (isNew) {
      setHasSignedInBefore(isNew)
      setValue(isNew)
    }
    dispatch(isSignedInAction({ isSignedIn: isNew }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [signedIn] = useListenToPostMessage("is-signed-in", onMessage);

  return [signedIn, hasSignedInBefore];
};

export default useCheckSignInStatus
