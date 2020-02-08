import React from "react"
import { Tooltip } from "@rmwc/tooltip"
// import "@rmwc/tooltip/tooltip.css"
import { InitialsContainer, InitialLetter } from "./styled"
import { WorkspaceStub } from "../../types"

const getSpaceInitials = (name: string) => {
  const splittedName = name.split(" ")
  const [firstSubstring, secondSubstring] = splittedName
  const firstLetter = firstSubstring[0]
  const secondLetter = secondSubstring ? secondSubstring[0] : firstSubstring[1]
  return [firstLetter, secondLetter]
}

interface Props {
  space: WorkspaceStub
  active?: boolean
  className?: string
}

export const SpaceIcon = ({ space, active, className }: Props) => {
  const navigateToWorkspace = () => {}
  const [firstLetter, secondLetter] = getSpaceInitials(space.name)

  return (
    <Tooltip content={(space && space.name) || ""} align="right">
      <InitialsContainer className={className} onClick={navigateToWorkspace} active={active}>
        <InitialLetter>{firstLetter}</InitialLetter>
        <InitialLetter gray>{secondLetter}</InitialLetter>
      </InitialsContainer>
    </Tooltip>
  )
}
