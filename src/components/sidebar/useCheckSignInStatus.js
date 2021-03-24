import { useCallback, useState } from "react";
import { useLocalStorage } from "react-use";
import { useListenToPostMessage } from "@/src/utils/post-message";

const useCheckSignInStatus = () => {
  const [value, setValue] = useLocalStorage("has-sign-in-history")
  const [hasSignedInBefore, setHasSignedInBefore] = useState(value)

  const onMessage = useCallback(isNew => {
    setHasSignedInBefore(isNew)
    setValue(isNew)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [signedIn] = useListenToPostMessage("is-signed-in", onMessage);

  return [signedIn, hasSignedInBefore];
};

export default useCheckSignInStatus
