import styled from "styled-components"
import { getColor, getSizeBy, Icon, Drop } from "@netdata/netdata-ui"
import { Dropdown } from "@/src/components/mdx-components/dropdown"
import { dialogsZIndex, customDropdownZIndex } from "@/src/styles/z-index"

export const PickerBox = styled.div`
  display: flex;
  position: relative;
  min-width: ${getSizeBy(102)};
  min-height: ${getSizeBy(43)};
  flex-direction: column;
  align-items: flex-end;
  background-color: ${getColor("mainBackground")};
  color: ${getColor("text")};
  z-index: ${dialogsZIndex};
  border-radius: 8px;
`

export const StyledTimePeriod = styled.span`
  margin-top: ${getSizeBy(3)};
  cursor: pointer;
  width: 187px;
  height: ${getSizeBy(2)};
  &:first-of-type {
    margin-top: ${getSizeBy(1)};
  }
  &:last-of-type {
    margin-bottom: ${getSizeBy(1)};
  }
  & > span:hover {
    color: ${getColor("textLite")};
  }
`
export const StyledCustomTimePeriod = styled.span`
  margin: ${getSizeBy(1)} ${getSizeBy(3)} 0;
  color: ${({ isSelected, theme }) => getColor(isSelected ? "primary" : "text")({ theme })};
  cursor: pointer;
  &:first-of-type {
    margin-top: 0;
  }
  &:hover {
    color: ${getColor("textLite")};
  }
`

export const StyledDropdown = styled(Dropdown)`
  width: 88px;
  height: 32px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 8px;
  padding-right: 7px;
  border: 1px solid ${getColor("border")};
  box-sizing: border-box;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${getColor("text")};
  .mdc-menu-surface--anchor {
    .mdc-menu-surface--open {
      ${customDropdownZIndex}
      margin-top: ${getSizeBy(2)};
      background: ${getColor("mainBackground")};
      border-radius: 4px;
    }
  }
  .mdc-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`
export const DropdownIcon = styled(Icon)`
  fill: ${getColor("text")};
  width: 12px;
  height: 12px;
`

export const CustomInput = styled.input`
  border: 1px solid ${getColor("border")};
  color: inherit;
  background: ${getColor("mainBackground")};
  box-sizing: border-box;
  border-radius: 4px;
  padding: 4px;
  width: 32px;
  height: 32px;
  margin-left: 10px;
  margin-right: 10px;
  outline: none;
  &:focus {
    border: 1px solid ${getColor("primary")};
  }
`
export const StyledDrop = styled(Drop).attrs({
  background: "mainBackground",
  round: 2,
  margin: [4, 0, 0],
  border: { side: "all", color: "elementBackground" },
  animation: true,
})`
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`
export const StyledHR = styled.hr`
  border: none;
  margin: 0;
  border-left: 1px solid ${getColor("borderSecondary")};
  height: 284px;
`
