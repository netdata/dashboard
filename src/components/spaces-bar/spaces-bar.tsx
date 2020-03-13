import React from "react"
import { Button } from "@netdata/netdata-ui"
import { getIframeSrc } from "utils"
import {
  ListContainer, SpacesList, SeparatedSection, SpacePlaceholder,
} from "./styled"

interface Props {
  cloudBaseURL: string
  isSignedIn: boolean
}
export const SpacesBar = ({
  cloudBaseURL,
  isSignedIn,
}: Props) => (
  <ListContainer>
    {isSignedIn ? (
      <iframe
        src={getIframeSrc(cloudBaseURL, "space-bar")}
        title="Space Bar"
        height="100%"
        width="100%"
        style={{ border: "none" }}
      />
    ) : (
      <>
        <SpacesList>
          <SpacePlaceholder />
        </SpacesList>
        <SeparatedSection>
          <Button icon="plus" onClick={() => {}} />
        </SeparatedSection>
      </>
    )}
  </ListContainer>
)
