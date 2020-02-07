import React from "react"
import { IconContainer } from "../../styled"
import { StyledButton, IndicatorsContainer, AlarmIndicator } from "./styled"
import { mockedAlarmsCount } from "../../mocks"

export const AlarmsControl = () => {
  const { critical, warning } = mockedAlarmsCount
  return (
    <IconContainer>
      <IndicatorsContainer>
        {critical > 0 && <AlarmIndicator alarmType="critical" />}
        {warning > 0 && <AlarmIndicator alarmType="warning" />}
      </IndicatorsContainer>
      <StyledButton type="borderless" icon="alarm" />
    </IconContainer>
  )
}
