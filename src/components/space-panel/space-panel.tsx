import React from "react"
import { useSelector } from "react-redux"
import { PanelContainer, ScrollContainer, PanelHeader } from "./styled"
import { VisitedNodes } from "./components/visited-nodes"
import { selectSpacePanelIsActive } from "../../domains/global/selectors"

export const SpacePanel = () => {
  const workspace = false
  const panelIsActive = useSelector(selectSpacePanelIsActive) as boolean
  return (
    <PanelContainer isActive={panelIsActive}>
      {workspace ? (
        <ScrollContainer />
      ) : (
        <ScrollContainer>
          <VisitedNodes />
        </ScrollContainer>
      )}
    </PanelContainer>
  )
}

/*
      <WorkspaceRooms />
      <WorkspaceApps />
 */
