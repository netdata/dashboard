import React from "react"
import { IconContainer } from "../../styled"
import {
  StyledButton, IndicatorsContainer, AlarmIndicator, StyledButtonContainer,
} from "./styled"

interface Props {
  criticalAlarmsCount: number
  warningAlarmsCount: number
}
export const AlarmsControl = ({
  criticalAlarmsCount,
  warningAlarmsCount,
}: Props) => (
  <IconContainer>
    <IndicatorsContainer>
      {criticalAlarmsCount > 0 && <AlarmIndicator alarmType="critical" />}
      {warningAlarmsCount > 0 && <AlarmIndicator alarmType="warning" />}
    </IndicatorsContainer>
    <StyledButtonContainer
      href="#"
      className="btn"
      data-toggle="modal"
      data-target="#alarmsModal"
    >
      <StyledButton type="borderless" icon="alarm" />
    </StyledButtonContainer>
  </IconContainer>
)
