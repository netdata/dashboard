import React from "react"
import { Button } from "@netdata/netdata-ui"
import { IconContainer } from "../../styled"

const getAlarmIconName = (criticalAlarmsCount: number, warningAlarmsCount: number) => {
  if (criticalAlarmsCount > 0 && warningAlarmsCount > 0) {
    return "alarmCriticalWarning"
  }
  if (criticalAlarmsCount > 0) {
    return "alarmCritical"
  }
  if (warningAlarmsCount > 0) {
    return "alarmWarning"
  }
  return "alarm"
}

interface Props {
  criticalAlarmsCount: number
  warningAlarmsCount: number
}
export const AlarmsControl = ({
  criticalAlarmsCount,
  warningAlarmsCount,
}: Props) => (
  <IconContainer>
    <Button
      flavour="borderless"
      neutral
      themeType="dark"
      className="btn"
      data-toggle="modal"
      data-target="#alarmsModal"
      icon={getAlarmIconName(criticalAlarmsCount, warningAlarmsCount)}
      title="Alarms"
    />
  </IconContainer>
)
