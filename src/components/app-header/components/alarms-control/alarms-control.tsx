import React from "react"
import { Button } from "@netdata/netdata-ui"
import { IconContainer } from "../../styled"
import { IndicatorsContainer, AlarmIndicator } from "./styled"

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

    <Button
      flavour="borderless"
      neutral
      themeType="dark"
      className="btn"
      data-toggle="modal"
      data-target="#alarmsModal"
      icon="alarm"
      title="Alarms"
    />
  </IconContainer>
)
