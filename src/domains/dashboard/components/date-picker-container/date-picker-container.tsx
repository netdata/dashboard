import React from "react"

import { ReduxWrappedPicker } from "components/date-picker"

import { DatePickerPortal } from "./date-picker-portal"
import * as S from "./styled"

export const DatePickerContainer = () => (
  <DatePickerPortal>
    <S.DatePickerContainer>
      <ReduxWrappedPicker />
    </S.DatePickerContainer>
  </DatePickerPortal>
)
