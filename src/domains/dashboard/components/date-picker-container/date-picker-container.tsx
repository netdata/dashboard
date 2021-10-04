import React from "react"

import { ReduxDatePickerContainer } from "components/date-picker"

import { DatePickerPortal } from "./date-picker-portal"
import * as S from "./styled"

export const DatePickerContainer = () => (
  <DatePickerPortal>
    <ReduxDatePickerContainer />
  </DatePickerPortal>
)
