import styled from "styled-components"
import { getColor, getSizeBy } from "@netdata/netdata-ui"

const CSSVariables = styled.div`
  width: 100%;
  .node-view__container {
    background: ${getColor("mainBackground")};
  }
  .node-view__container > .charts-body {
    padding: ${getSizeBy(3)} !important;
    z-index: 1;
  }
  .netdata-container-with-legend {
    transform: none;
    margin-top: 8px;
  }

  .netdata-chartblock-container {
    margin-top: 8px;
  }

  --color-primary: ${getColor("primary")};
  --color-accent: ${getColor("accent")};
  --color-main: ${getColor("main")};
  --color-border: ${getColor("border")};
  --color-borderSecondary: ${getColor("borderSecondary")};
  --color-disabled: ${getColor("disabled")};
  --color-elementBackground: ${getColor("elementBackground")};
  --color-mainBackground: ${getColor("mainBackground")};
  --color-mainBackgroundDisabled: ${getColor("mainBackgroundDisabled")};
  --color-success: ${getColor("success")};
  --color-warning: ${getColor("warning")};
  --color-error: ${getColor("error")};
  --color-attention: ${getColor("attention")};
  --color-separator: ${getColor("separator")};
  --color-controlFocused: ${getColor("controlFocused")};
  --color-selected: ${getColor("selected")};
  --color-tooltip: ${getColor("tooltip")};
  --color-bright: ${getColor("bright")};
  --color-text: ${getColor("text")};
  --color-textFocus: ${getColor("textFocus")};
  --color-sectionHeaderBackground: ${getColor("sectionHeaderBackground")};
  --color-placeholder: ${getColor("placeholder")};
`

export default CSSVariables
