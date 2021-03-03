import { useRef } from "react"
import { equals, identity } from "ramda"
import { useContextSelector } from "use-context-selector"

export default (Context, select = identity) => {
  const prevRef = useRef()
  return useContextSelector(Context, state => {
    const selected = select(state)
    if (!equals(prevRef.current, selected)) prevRef.current = selected
    return prevRef.current
  })
}
