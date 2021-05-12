import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch } from "store/redux-separate-context"
import { resetGlobalPauseAction, setOptionAction } from "domains/global/actions"

const playAction = value =>
  setOptionAction({ key: "stop_updates_when_focus_is_lost", value: !value })

const useTimeframe = () => {
  const [timeframe, setTimeframe] = useState()
  const timeoutRef = useRef(null)

  const dispatch = useDispatch()

  const play = useCallback(() => {
    dispatch(resetGlobalPauseAction())
    dispatch(playAction(true))
  }, [dispatch])

  const stop = useCallback(() => dispatch(playAction(false)), [dispatch])

  useEffect(() => {
    if (!timeframe) stop()
    if (timeframe === "unlimited") play()
    if (timeframe === "limited") {
      play()
      timeoutRef.current = setTimeout(() => setTimeframe(null), 1000 * 15)
    }

    return () => clearTimeout(timeoutRef.current)
  }, [timeframe, play, stop])

  return [timeframe, setTimeframe]
}

export default useTimeframe
