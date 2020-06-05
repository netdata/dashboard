import styled from "styled-components"

import { chartDropdownZIndex } from "styles/z-index"

export const ChartDropdownContainer = styled.div`
  position: absolute;
  top: 0;
  left: 40px;
  width: 20px;
  height: 20px;
  z-index: ${chartDropdownZIndex};
`
