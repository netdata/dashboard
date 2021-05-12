import React, { useMemo } from "react"
import { useSelector } from "store/redux-separate-context"
import {
  selectHasWindowFocus,
  selectGlobalPanAndZoom,
  selectGlobalSelection,
  selectGlobalPause,
  selectStopUpdatesWhenFocusIsLost,
} from "domains/global/selectors"
import { ReduxWrappedPicker } from "components/date-picker"
import Container from "./container"
import PlayPausePill from "./playPausePill"
import ForcePlayAlert from "../forcePlayAlert"

const GlobalControls = () => {
  const hasWindowFocus = useSelector(selectHasWindowFocus)
  const stopUpdatesWhenFocusIsLost = useSelector(selectStopUpdatesWhenFocusIsLost)
  const globalPanAndZoom = useSelector(selectGlobalPanAndZoom)
  const hoveredX = useSelector(selectGlobalSelection)
  const globalPause = useSelector(selectGlobalPause)

  const isPlaying = useMemo(
    () =>
      Boolean(
        (hasWindowFocus || !stopUpdatesWhenFocusIsLost) &&
          !globalPanAndZoom &&
          !hoveredX &&
          !globalPause
      ),
    [hasWindowFocus, stopUpdatesWhenFocusIsLost, globalPanAndZoom, hoveredX, globalPause]
  )

  return (
    <Container
      isPlaying={isPlaying}
      padding={[0, 2]}
      round
      height="100%"
      alignItems="center"
      gap={4}
    >
      <PlayPausePill isPlaying={isPlaying} />
      <ReduxWrappedPicker isPlaying={isPlaying} />
      <ForcePlayAlert />
    </Container>
  )
}

export default GlobalControls
