import styled from "styled-components"
import {
  getSizeBy, Text, TextSmall, getColor, Button, Icon,
} from "@netdata/netdata-ui"


export const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: ${getSizeBy(10)};
  display: flex;
  flex-flow: row nowrap;
  padding: ${getSizeBy(2)} ${getSizeBy(2)} ${getSizeBy()} ${getSizeBy(2)};
`

export const SideContent = styled.div<{ right?: boolean }>`
  flex-grow: 0;
  flex-shrink: 0;
  height: 100%;
  align-self: stretch;
`

export const ContentContainer = styled.div``

export const HeaderText = styled(Text) <{ error?: boolean; success?: boolean }>`
  color: ${({ error, success }) => (success && getColor(["success"])) || (error && getColor(["error"]))};
  font-weight: bold;
  display: block;
  margin-bottom: ${getSizeBy()};
`

export const ContentText = styled(TextSmall) <{ error?: boolean; success?: boolean }>`
  display: block;
  color: ${({ error }) => (error && getColor(["error"])) || getColor(["text"])};
  font-weight: ${({ error }) => error && "bold"};
`

export const ErrorContainer = styled.div`
  width: ${getSizeBy(5)};
  height: ${getSizeBy(5)};
  margin-right: ${getSizeBy()};
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ErrorIcon = styled(Icon)`
  fill: ${getColor(["error"])};
`
