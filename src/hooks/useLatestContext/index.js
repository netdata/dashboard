import { useRef } from "react"
import { useContextSelector } from "use-context-selector"

export default Context => {
  const ref = useRef()

  useContextSelector(Context, state => {
    ref.current = state
    return false
  })

  return ref
}
