import React from "react"
import { NavigationItem, StyledIcon, Hostname, AlarmIndicator } from "./styled"
import { mockedAlarmsCount, mockedHostname } from "../../mocks"

const getAlarmsCount = (count: number) => (count > 9 ? "9+" : `${count}`)

export const NodeInfo = () => {
  const hostname = mockedHostname
  const alarmsCount = mockedAlarmsCount // replace by selector
  const { warning, critical } = alarmsCount
  return (
    <NavigationItem>
      <StyledIcon name="node" />
      <Hostname>{hostname}</Hostname>
      {critical > 0 && (
        <AlarmIndicator alarmType="critical">{getAlarmsCount(critical)}</AlarmIndicator>
      )}
      {warning > 0 && (
        <AlarmIndicator alarmType="warning">{getAlarmsCount(warning)}</AlarmIndicator>
      )}
    </NavigationItem>
  )
}
