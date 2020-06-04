import styled from "styled-components"
import {
  getColor, getSizeBy, Icon, Text, breakpoints,
} from "@netdata/netdata-ui"

export const NavigationItem = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 100%;

  @media ${breakpoints.mobileSmall} {
    display: none;
  }

  @media ${breakpoints.tablet} {
    display: flex;
  }
`

export const StyledIcon = styled(Icon)`
  fill: ${getColor(["white", "pure"])};
`

export const Hostname = styled(Text)`
  color: ${getColor(["white", "pure"])};
  font-weight: bold;
  padding: 0 12px;
`

const alarmColors = {
  critical: getColor(["error"]),
  warning: getColor(["warning"]),
}

type AlarmType = "critical" | "warning"

export const AlarmIndicator = styled.div<{ alarmType: AlarmType }>`
  width: ${getSizeBy(2)};
  height: ${getSizeBy(2)};
  color: ${getColor(["white", "pure"])};
  border-radius: 2px;
  background: ${({ alarmType, ...props }) => {
    const getBackgroundColor = alarmColors[alarmType]
    return getBackgroundColor(props)
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${getSizeBy()};
`
