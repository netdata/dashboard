import { useCallback, useEffect, useRef } from "react"

export const useCloseOnOutsideClick = (onClose: () => void) => {
  const ref = useRef(null)
  const escapeListener = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    },
    [onClose],
  )
  const clickListener = useCallback(
    (e: MouseEvent) => {
      if (ref.current && !(ref.current! as any).contains(e.target)) {
        if (onClose && typeof onClose === "function") {
          onClose()
        }
      }
    },
    [onClose],
  )
  useEffect(() => {
    document.addEventListener("click", clickListener)
    document.addEventListener("keyup", escapeListener)
    return () => {
      document.removeEventListener("click", clickListener)
      document.removeEventListener("keyup", escapeListener)
    }
  }, [clickListener, escapeListener])
  return ref
}
