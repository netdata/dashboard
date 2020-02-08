import React from "react"
import { Button } from "@netdata/netdata-ui"
import { SpaceIcon } from "./components/space-icon"
import { ListContainer, SpacesList, SeparatedSection, SpacePlaceholder } from "./styled"
import { mockedSpacesList } from "./mocks"

export const SpacesBar = () => {
  const spaces = mockedSpacesList
  const currentSpaceId = "id"

  return (
    <ListContainer>
      <SpacesList>
        {spaces.length ? (
          spaces.map((space, i) => {
            const isActive = space.id === currentSpaceId
            return <SpaceIcon key={i} space={space} active={isActive} />
          })
        ) : (
          <SpacePlaceholder />
        )}
      </SpacesList>

      <SeparatedSection>
        <Button icon="plus" onClick={() => {}} />
      </SeparatedSection>
    </ListContainer>
  )
}
