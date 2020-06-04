import React from "react"
import {
  NavigationItem, StyledIcon, Hostname, AlarmIndicator,
} from "./styled"

const getAlarmsCount = (count: number) => (count > 9 ? "9+" : `${count}`)

interface Props {
  criticalAlarmsCount: number
  warningAlarmsCount: number
  hostname: string
}
export const NodeInfo = ({
  criticalAlarmsCount,
  warningAlarmsCount,
  hostname,
}: Props) => (
  <NavigationItem>
    <StyledIcon name="node" />
    <Hostname>{hostname}</Hostname>
    {criticalAlarmsCount > 0 && (
      <AlarmIndicator alarmType="critical">{getAlarmsCount(criticalAlarmsCount)}</AlarmIndicator>
    )}
    {warningAlarmsCount > 0 && (
      <AlarmIndicator alarmType="warning">{getAlarmsCount(warningAlarmsCount)}</AlarmIndicator>
    )}
  </NavigationItem>
)
