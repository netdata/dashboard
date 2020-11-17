import styled from "styled-components"

import { HEADER_SIZE } from "components/app-header/styled"

const PICKER_RIGHT_MARGIN = 12

export const DatePickerContainer = styled.div`
  position: fixed;
  height: 70px;
  right: ${PICKER_RIGHT_MARGIN}px;
  
  top: ${HEADER_SIZE}px;
  
  /* media styling, needs to match .sidebar-body in main.css */
  @media (min-width: 1360px) {
    width: ${263 - PICKER_RIGHT_MARGIN}px;
  }
  @media (min-width: 1200px) {
    width: ${233 - PICKER_RIGHT_MARGIN}px;
  }
  @media (min-width: 992px) {
    width: ${213 - PICKER_RIGHT_MARGIN}px;
  }
  display: flex;
  align-items: center;
`
