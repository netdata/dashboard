import { useCallback, useState } from "react";
import { useLocalStorage } from "react-use";
import { useListenToPostMessage } from "@/src/utils/post-message";

const useCheckSignInStatus = () => {
  const [value, setValue] = useLocalStorage("has-sign-in-history");
  const [hasSignedInBefore, setHasSignedInBefore] = useState(() => value);

  const onMessage = useCallback(isNew => {
    if (isNew) {
      setHasSignedInBefore(true);
      setValue(true);
    }
    if (!isNew) {
      setHasSignedInBefore(false);
      setValue(false);
    }
  }, []);

  const [signedIn] = useListenToPostMessage("is-signed-in", onMessage);

  return [signedIn, hasSignedInBefore];
};

export default useCheckSignInStatus
