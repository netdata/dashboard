import React from "react"
import { useSelector, useDispatch } from "react-redux"

import { SPACE_PANEL_STATE } from "utils/utils"
import NetdataLogo from "./assets/netdata-logo.svg"
import { LogoSection, LogoContainer, StyledButton } from "./styled"
import { setSpacePanelStatusAction } from "../../../../domains/global/actions"
import { selectSpacePanelIsActive } from "../../../../domains/global/selectors"

export const PanelControl = () => {
  const dispatch = useDispatch()
  const spacePanelIsActive = useSelector(selectSpacePanelIsActive)

  return (
    <LogoSection>
      <LogoContainer>
        <svg width="100%" height="100%" viewBox={NetdataLogo.viewBox}>
          <use xlinkHref={`#${NetdataLogo.id}`} />
        </svg>
      </LogoContainer>
      <StyledButton
        neutral
        flavour="borderless"
        icon="hamburger"
        onClick={() => {
          localStorage.setItem(SPACE_PANEL_STATE, String(!spacePanelIsActive))
          dispatch(setSpacePanelStatusAction({ isActive: !spacePanelIsActive }))
        }}
        themeType="dark"
      />
    </LogoSection>
  )
}
