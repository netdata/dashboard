import styled from "styled-components"

import {
  getColor, getSizeBy, Text, Icon, PortalSidebar,
} from "@netdata/netdata-ui"

import { dialogsZIndex, customDropdownZIndex, portalSidebarZIndex } from "styles/z-index"
// todo move those components to netdata-ui to reuse them with the cloud
import { Dropdown } from "components/mdx-components/dropdown"
import { RMWCThemeProvider } from "@/src/rmwc-theme-provider"

// todo fix "any"
export const StyledSidebar = (styled(PortalSidebar) as any).attrs(() => ({
  Wrapper: RMWCThemeProvider,
}))`
  width: ${getSizeBy(83)};
  height: ${getSizeBy(51)};
  overflow: visible;
  top: ${getSizeBy(14)};
  ${portalSidebarZIndex}
`
export const PickerBox = styled.div`
  display: flex;
  position: relative;
  min-width: ${getSizeBy(83)};
  min-height: ${getSizeBy(43)};
  flex-direction: column;
  align-items: flex-end;
  background-color: ${getColor("mainBackground")};
  color: ${getColor("text")};
  z-index: ${dialogsZIndex};
`
export const HeaderSvg = styled.svg`
  fill: ${getColor("text")};
  height: 14px;
  width: 14px;
`
export const IconSpacer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: ${getSizeBy()};
`

export const PickerActionArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: flex-end;
`
export const PickerBtnArea = styled.div`
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${getSizeBy(2)};
  width: 100%;
`

export const ShortPickHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: ${getSizeBy(2)};
  padding: ${getSizeBy(2)};
  color: ${getColor("text")};
  font-weight: 700;
  line-height: 156px;
  height: 24px;
  margin-top: ${getSizeBy()};
  margin-bottom: ${getSizeBy()};
  margin-left: ${getSizeBy(2)};
`

export const ShortPick = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`
export const ShortPickElement = styled.div<{ isSelected?: boolean }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: ${({ isSelected, theme }) => getColor(isSelected ? "primary" : "text")({ theme })};
  margin-left: ${getSizeBy(2)};
  margin-top: ${getSizeBy(2)};
  width: 187px;
  height: ${getSizeBy(2)};
  padding: ${getSizeBy(2)};
  cursor: pointer;
  &:hover {
    color: ${getColor("primary")};
  }
`
export const AccessorBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  color: ${getColor("text")};
  align-items: center;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #aeb3b7;
  box-sizing: border-box;
  white-space: nowrap;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
`

export const DropdownBox = styled.div`
  position: absolute;
  left: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0px;
  position: absolute;
  height: 32px;
`

export const StyledDropdown = (styled(Dropdown) as any)`
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
      margin-left: -16px;
      margin-top: ${getSizeBy(2)};
      width: ${getSizeBy(35)};
      background: ${getColor("mainBackground")};
      ${customDropdownZIndex}
    }
  }
`
export const TypeViewBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row nowrap;
  align-items: center;
`
export const DropdownIcon = styled(Icon)`
  fill: ${getColor("text")};
  width: 12px;
  height: 12px;
`
export const TextBox = styled(Text)`
  flex: 1;
  padding-right: 15px;
`
export const LastText = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 14px;
`
export const CustomInput = styled.input`
  border: 1px solid ${getColor("border")};
  background: ${getColor("mainBackground")};
  box-sizing: border-box;
  border-radius: 4px;
  padding: 4px;
  width: 32px;
  height: 32px;
  margin-left: 10px;
  margin-right: 10px;
  outline: none;
  color: inherit; // needed for dashboard, in cloud it's default value
  &:focus {
    border: 1px solid ${getColor("primary")};
  }
`

export const StartEndContainer = styled.div`
  margin-left: 4px;
`

export const ArrowsIcon = styled(Icon)`
  height: 8px;
  margin-left: auto;
  fill: ${getColor("text")};
`
