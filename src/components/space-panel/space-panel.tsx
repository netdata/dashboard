import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import { selectSpacePanelIsActive } from "domains/global/selectors"
import { setSpacePanelStatusAction } from "domains/global/actions"
import { ChartsMetadata } from "domains/global/types"

import { VisitedNodes } from "./components/visited-nodes"
import { ReplicatedNodes } from "./components/replicated-nodes"
import { SpaceRooms } from "./components/space-rooms"

import {
  PanelContainer, ScrollContainer, PanelHeader, PanelSection,
} from "./styled"

const withPrivateRegistry = true
const loggedInCloud = false

interface Props {
  chartsMetadata: ChartsMetadata
}
export const SpacePanel = ({
  chartsMetadata,
}: Props) => {
  const dispatch = useDispatch()
  const panelIsActive = useSelector(selectSpacePanelIsActive)

  useEffect(() => {
    dispatch(setSpacePanelStatusAction({ isActive: true }))
  }, [dispatch])

  const hasStreamedHosts = chartsMetadata.hosts.length > 1

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
          {hasStreamedHosts && (
            <PanelSection leading>
              <ReplicatedNodes chartsMetadata={chartsMetadata} />
            </PanelSection>
          )}
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
