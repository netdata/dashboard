import React from "react"
import { getIframeSrc } from "utils"
import {
  ListContainer, SpacesList, SeparatedSection, SpacePlaceholder, StyledSpaceBarPlus,
} from "./styled"

interface Props {
  cloudBaseURL: string
  isOffline: boolean
  isSignedIn: boolean
  enoughWaitingForIframe: boolean
  signInUrl: string
}
export const SpacesBar = ({
  cloudBaseURL,
  isOffline,
  isSignedIn,
  enoughWaitingForIframe,
  signInUrl,
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
    ) : (enoughWaitingForIframe && (
      <>
        <SpacesList>
          <SpacePlaceholder />
        </SpacesList>
        <SeparatedSection>
          <StyledSpaceBarPlus
            isDisabled={isOffline}
            icon="plus"
            onClick={() => {
              window.location.href = signInUrl
            }}
          />
        </SeparatedSection>
      </>
    ))}
  </ListContainer>
)
