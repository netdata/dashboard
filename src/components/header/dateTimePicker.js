import React from "react"
import { ReduxWrappedPicker } from "components/date-picker"
import Item from "./item"

const DateTimePicker = () => (
  <Item hasBorder>
    <ReduxWrappedPicker />
  </Item>
)

export default DateTimePicker
