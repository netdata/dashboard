import { useEffect, useRef } from "react"
import { useToggle } from "react-use"
import { useSelector } from "store/redux-separate-context"
import { selectHasWindowFocus } from "domains/global/selectors"

const useSnackbar = timeframe => {
    const [isOpen, toggle] = useToggle()
    const discardTimemoutRef = useRef(null)
    const wasOpen = useRef()
    const isWindowFocused = useSelector(selectHasWindowFocus)
  
    useEffect(() => {
      if (isOpen) return
      !isWindowFocused && !wasOpen.current && toggle()
      wasOpen.current = !isWindowFocused
    }, [isOpen, isWindowFocused, toggle])
  
    useEffect(() => {
      if (!isOpen) return
  
      const duration = timeframe ? 6 : 10
      discardTimemoutRef.current = setTimeout(() => toggle(false), 1000 * duration)
  
      return () => clearTimeout(discardTimemoutRef.current)
    }, [isOpen, timeframe, toggle])
  
    return [isOpen, toggle]
  }

  export default useSnackbar