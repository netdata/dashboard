import React from "react"
import {
  Container,
  VersionIndicator,
  NewVersionIndicator,
  StyledIcon,
  TextBold,
  VersionNumber,
  CollapsableText,
} from "./styled"
import { version, isNewVersionAvailable } from "../../mocks"

export const VersionControl = () => (
  <Container>
    <VersionIndicator>
      <CollapsableText>Agent Version</CollapsableText>
      <VersionNumber>{version}</VersionNumber>
    </VersionIndicator>
    {isNewVersionAvailable && (
      <NewVersionIndicator>
        <StyledIcon name="logo_s" />
        <TextBold> New version avaliable </TextBold>
      </NewVersionIndicator>
    )}
  </Container>
)
