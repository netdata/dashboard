import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { PanelContainer, ScrollContainer, PanelHeader, PanelSection } from "./styled"
import { VisitedNodes } from "./components/visited-nodes"
import { ReplicatedNodes } from "./components/replicated-nodes"
import { SpaceRooms } from "./components/space-rooms"
import { selectSpacePanelIsActive } from "../../domains/global/selectors"
import { setSpacePanelStatusAction } from "../../domains/global/actions"

const withPrivateRegistry = true
const loggedInCloud = true

export const SpacePanel = () => {
  const dispatch = useDispatch()
  const panelIsActive = useSelector(selectSpacePanelIsActive) as boolean

  useEffect(() => {
    dispatch(setSpacePanelStatusAction({ isActive: true }))
  }, [dispatch])

  return (
    <PanelContainer isActive={panelIsActive}>
      {loggedInCloud ? (
        <>
          <PanelHeader>Placeholder Name</PanelHeader>
          <ScrollContainer>
            <SpaceRooms />
            <PanelSection>
              <VisitedNodes />
            </PanelSection>
          </ScrollContainer>
        </>
      ) : (
        <ScrollContainer>
          <PanelSection leading>
            <ReplicatedNodes />
          </PanelSection>
          {withPrivateRegistry && (
            <PanelSection>
              <VisitedNodes />
            </PanelSection>
          )}
        </ScrollContainer>
      )}
    </PanelContainer>
  )
}

/*
      <WorkspaceRooms />
      <WorkspaceApps />
 */
