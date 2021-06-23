import React, { useMemo } from "react"
import { useDispatch } from "store/redux-separate-context"
import { resetGlobalPauseAction, setGlobalPauseAction } from "domains/global/actions"
import { Tooltip, TextSmall } from "@netdata/netdata-ui"
import StyledPill from "./styledPill"

const ButtonTooltip = ({ isPlaying }) => (
  <TextSmall color="bright" whiteSpace="nowrap">
    {isPlaying ? "Click to pause" : "Click to play"}
  </TextSmall>
)

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
    <Tooltip content={<ButtonTooltip isPlaying={isPlaying} />} align="bottom">
      <StyledPill icon={icon} onClick={isPlaying ? onPause : onPlay} isPlaying={isPlaying}>
        {isPlaying ? "Playing" : "Paused"}
      </StyledPill>
    </Tooltip>
  )
}

export default PlayPausePill
