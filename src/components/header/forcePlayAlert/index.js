import styled from "styled-components"
import React, { Fragment, useCallback, useRef } from "react"
import { Layer, Flex, Text, Button } from "@netdata/netdata-ui"
import { useSelector } from "store/redux-separate-context"
import { selectStopUpdatesWhenFocusIsLost } from "domains/global/selectors"
import useTimeframe from "./useTimeframe"
import useSnackbar from "./useSnackbar"

const InvertedText = styled(Text).attrs(({ theme }) => ({
  color: theme.name === "Dark" ? "panel" : "bright",
}))``

const InvertedButton = styled(Button).attrs(({ theme }) => ({
  themeType: theme.name === "Dark" ? "light" : "dark",
}))``

const promptMap = {
  default:
    "These charts are paused for better system performance when tab loses focus. Click to keep continuously refreshing charts in the background for:",
  unlimited:
    "Done! These charts now update in the background forever, even when this tab loses focus, until you go back to the default.",
  limited:
    "Done! These charts now update in the background for 15 minutes, even when this tab loses focus, until you go back to the default.",
}

const ForcePlayAlert = () => {
  const ref = useRef()
  const shouldStopUpdates = useSelector(selectStopUpdatesWhenFocusIsLost)

  const [timeframe, setTimeframe] = useTimeframe()
  const [isOpen, toggle] = useSnackbar(timeframe)

  const reset = useCallback(
    e => {
      if (!e.target.nodeName) return
      setTimeframe(null)
    },
    [setTimeframe]
  )

  return isOpen ? (
    <Layer position="bottom" backdrop={false} margin={[0, 0, 4]} onClickOutside={reset}>
      <Flex
        background="main"
        round
        padding={[6]}
        gap={6}
        width={{ max: "640px" }}
        alignItems="center"
        ref={ref}
        toggle={toggle}
      >
        <Fragment>
          <InvertedText>{promptMap[timeframe || "default"]}</InvertedText>
          {shouldStopUpdates && (
            <Fragment>
              <Button
                label="15 MIN"
                flavour="borderless"
                success
                onClick={() => setTimeframe("limited")}
              />
              <Button
                label="FOREVER"
                flavour="borderless"
                success
                onClick={() => setTimeframe("unlimited")}
              />
            </Fragment>
          )}
          {!shouldStopUpdates && (
            <Button label="UNDO" flavour="borderless" warning onClick={reset} />
          )}
          <InvertedButton
            flavour="borderless"
            neutral
            icon="x"
            title="Close force play alert"
            name="Force play alert button"
            onClick={toggle}
          />
        </Fragment>
      </Flex>
    </Layer>
  ) : null
}

export default ForcePlayAlert
