import styled from "styled-components"
import { Button, getColor } from "@netdata/netdata-ui"

export const Container = styled.div`
  position: relative;
`

export const StyledButton = styled(Button)``

export const StyledButtonContainer = styled.a`
  padding: 0;
`


const alarmColors = {
  critical: getColor(["error"]),
  warning: getColor(["warning"]),
}

type AlarmType = "critical" | "warning"

export const AlarmIndicator = styled.div<{ alarmType: AlarmType }>`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${({ alarmType, ...props }) => {
    const getBackgroundColor = alarmColors[alarmType]
    return getBackgroundColor(props)
  }};
`

export const IndicatorsContainer = styled.div`
  position: absolute;
  top: 12px;
  right: 9px;
  width: 9px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`
