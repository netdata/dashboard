import styled from "styled-components"
import { getSizeBy, getColor, Text } from "@netdata/netdata-ui"

export const InitialsContainer = styled.div<{ active?: boolean }>`
  width: ${getSizeBy(5)};
  height: ${getSizeBy(5)};
  margin-bottom: ${getSizeBy(2)};
  background: ${getColor(["neutral", "white"])};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${getSizeBy()};
  border: 2px solid;
  cursor: pointer;
  border-color: ${({ active }) =>
    active ? getColor("success") : getColor(["neutral", "limedSpruce"])};
`

export const InitialLetter = styled(Text)<{ gray?: boolean }>`
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ gray }) => (gray ? getColor("border") : getColor("text"))};
`
