import { createGlobalStyle } from "styled-components"
import { getColor } from "@netdata/netdata-ui"

export const GlobalColors = createGlobalStyle`
  :root {
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
    --color-attentionSecondary: ${getColor("attentionSecondary")};
    --color-separator: ${getColor("separator")};
    --color-controlFocused: ${getColor("controlFocused")};
    --color-selected: ${getColor("selected")};
    --color-tooltip: ${getColor("tooltip")};
    --color-bright: ${getColor("bright")};
    --color-text: ${getColor("text")};
    --color-textFocus: ${getColor("textFocus")};
    --color-sectionHeaderBackground: ${getColor("sectionHeaderBackground")};
    --color-placeholder: ${getColor("placeholder")};
  }
`
