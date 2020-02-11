import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { PanelContainer, ScrollContainer, PanelHeader, PanelSection } from "./styled"
import { VisitedNodes } from "./components/visited-nodes"
import { ReplicatedNodes } from "./components/replicated-nodes"
import { selectSpacePanelIsActive } from "../../domains/global/selectors"
import { setSpacePanelStatusAction } from "../../domains/global/actions"

const withPrivateRegistry = true
const loggedInCloud = false

export const SpacePanel = () => {
  const dispatch = useDispatch()
  const panelIsActive = useSelector(selectSpacePanelIsActive) as boolean

  useEffect(() => {
    dispatch(setSpacePanelStatusAction({ status: true }))
  }, [dispatch])

  return (
    <PanelContainer isActive={panelIsActive}>
      {loggedInCloud ? (
        <ScrollContainer />
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
