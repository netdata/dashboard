import React from "react"
import { IconContainer } from "../../styled"
import { StyledButton, IndicatorsContainer, AlarmIndicator } from "./styled"

export const AlarmsControl = () => (
  <IconContainer>
    <IndicatorsContainer>
      <AlarmIndicator alarmType="critical" />
      <AlarmIndicator alarmType="warning" />
    </IndicatorsContainer>
    <StyledButton type="borderless" icon="alarm" />
  </IconContainer>
)
