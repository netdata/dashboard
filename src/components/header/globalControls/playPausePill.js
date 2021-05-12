import React from "react"
import { Pill } from "@netdata/netdata-ui"
import { useDispatch } from "store/redux-separate-context"
import { resetGlobalPauseAction, setFreezeChartsAction } from "domains/global/actions"

const PlayPausePill = ({ isPlaying }) => {
  const dispatch = useDispatch()

  const onPlay = () => dispatch(resetGlobalPauseAction())
  const onPause = () => dispatch(setFreezeChartsAction())

  return (
    <Pill
      flavour={isPlaying ? "success" : "neutral"}
      icon={isPlaying ? "playSolid" : "pauseSolid"}
      onClick={!isPlaying ? onPlay : onPause}
    >
      {isPlaying ? "Playing" : "Paused"}
    </Pill>
  )
}

export default PlayPausePill
