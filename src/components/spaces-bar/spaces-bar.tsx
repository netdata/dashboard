import React from "react"
import { Button } from "@netdata/netdata-ui"
import { getIframeSrc } from "utils/utils"
import { useSelector } from "store/redux-separate-context"
import { selectIsCloudEnabled } from "domains/global/selectors"

import {
  ListContainer, SpacesList, SeparatedSection, SpacePlaceholder,
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
}: Props) => {
  const isCloudEnabled = useSelector(selectIsCloudEnabled)
  if (!isCloudEnabled) {
    return (<ListContainer />)
  }
  return (
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
              disabled={isOffline}
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
}
