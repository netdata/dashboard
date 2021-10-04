import { useState, useCallback } from "react"

/**
 * @example
 * const [value, toggle, toggleOn, toggleOff]  = useToggle(false);
 *
 * @param {Boolean} initialValue
 */

const useToggle = (initialValue = false) => {
  const [value, setToggle] = useState(!!initialValue)
  const toggle = useCallback(() => setToggle(oldValue => !oldValue), [])
  const toggleOn = useCallback(() => setToggle(true), [])
  const toggleOff = useCallback(() => setToggle(false), [])

  return [value, toggle, toggleOn, toggleOff]
}

export default useToggle
