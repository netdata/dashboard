import React from "react"
import { Button } from "@netdata/netdata-ui"
import { getIframeSrc } from "utils"
import {
  ListContainer, SpacesList, SeparatedSection, SpacePlaceholder,
} from "./styled"

interface Props {
  cloudBaseURL: string
  isSignedIn: boolean
  enoughWaitingForIframe: boolean
  signInUrl: string
}
export const SpacesBar = ({
  cloudBaseURL,
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
          <Button
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
