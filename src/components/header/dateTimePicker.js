import React from "react"
import { ThemeProvider } from "styled-components"
import { ReduxWrappedPicker } from "components/date-picker"
import { DarkTheme } from "@netdata/netdata-ui"
import Item from "./item"

const DateTimePicker = () => (
  <ThemeProvider theme={DarkTheme}>
    <Item hasBorder>
      <ReduxWrappedPicker />
    </Item>
  </ThemeProvider>
)

export default DateTimePicker
