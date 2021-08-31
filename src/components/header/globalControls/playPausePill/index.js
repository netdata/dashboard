import React, { useMemo } from "react"
import { useDispatch } from "store/redux-separate-context"
import { resetGlobalPauseAction, setGlobalPauseAction } from "domains/global/actions"
import { TextSmall } from "@netdata/netdata-ui"
import Tooltip from "@/src/components/tooltips"
import StyledPill from "./styledPill"

const getIcon = (isPlaying, isForcePlaying) => {
  if (!isPlaying) return "pauseSolid"
  return isForcePlaying ? "forcePlay" : "playSolid"
}

const PlayPausePill = ({ isPlaying, isForcePlaying }) => {
  const dispatch = useDispatch()

  const onPlay = () => dispatch(resetGlobalPauseAction({ forcePlay: false }))
  const onPause = () => dispatch(setGlobalPauseAction())
  const icon = useMemo(() => getIcon(isPlaying, isForcePlaying), [isPlaying, isForcePlaying])

  return (
    <Tooltip content={isPlaying ? "Click to pause" : "Click to play"} align="bottom" plain>
      <StyledPill icon={icon} onClick={isPlaying ? onPause : onPlay} isPlaying={isPlaying}>
        {isPlaying ? "Playing" : "Paused"}
      </StyledPill>
    </Tooltip>
  )
}

export default PlayPausePill
