import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { Button } from "@netdata/netdata-ui"
import NetdataLogo from "./assets/netdata-logo.svg"
import { LogoSection, LogoContainer } from "./styled"
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
      <Button
        type="borderless"
        icon="hamburger"
        onClick={() => {
          dispatch(setSpacePanelStatusAction({ isActive: !spacePanelIsActive }))
        }}
      />
    </LogoSection>
  )
}
