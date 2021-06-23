import React, { useMemo, useRef } from "react"
import { useSelector } from "store/redux-separate-context"
import {
  selectHasWindowFocus,
  selectStopUpdatesWhenFocusIsLost,
  selectGlobalPanAndZoom,
  selectGlobalPause,
  selectGlobalSelection,
} from "domains/global/selectors"
import { ReduxWrappedPicker } from "components/date-picker"
import Item from "../item"
import Container from "./container"
import PlayPausePill from "./playPausePill"
import PlayOptions from "./playOptions"

const tagging = "global-view"

const GlobalControls = () => {
  const ref = useRef()
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
    <Item hasBorder>
      <Container
        isPlaying={isPlaying}
        padding={[2, 2]}
        round
        height="100%"
        alignItems="center"
        gap={1}
        ref={ref}
      >
        <PlayPausePill isPlaying={isPlaying} isForcePlaying={!stopUpdatesWhenFocusIsLost} />
        <PlayOptions target={ref} />
        <ReduxWrappedPicker isPlaying={isPlaying} tagging={tagging} />
      </Container>
    </Item>
  )
}

export default GlobalControls
