import React from "react"
import { Button } from "@netdata/netdata-ui"
import NetdataLogo from "./assets/netdata-logo.svg"
import { LogoSection, LogoContainer } from "./styled"

export const PanelControl = () => (
  <LogoSection>
    <LogoContainer>
      <svg width="100%" height="100%" viewBox={NetdataLogo.viewBox}>
        <use xlinkHref={`#${NetdataLogo.id}`} />
      </svg>
    </LogoContainer>
    <Button type="borderless" icon="hamburger" />
  </LogoSection>
)
