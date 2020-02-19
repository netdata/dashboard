import React from "react"
import { useHtpp } from "hooks/use-http"
import {
  Container,
  VersionIndicator,
  NewVersionIndicator,
  StyledIcon,
  TextBold,
  VersionNumber,
  CollapsableText,
} from "./styled"

const NETDATA_LATEST_VERSION_URL = "https://api.github.com/repos/netdata/netdata/releases/latest"
const NETDATA_LATEST_GCS_VERSION_URL = "https://www.googleapis.com/storage/v1/b/netdata-nightlies/o/latest-version.txt"

const transformGcsVersionResponse = (data: string) => data.replace(/(\r\n|\n|\r| |\t)/gm, "")

// eslint-disable-next-line camelcase
interface GithubResponse { tag_name: string }
const transformGithubResponse = (data: (null | GithubResponse)) => (
  // eslint-disable-next-line camelcase
  data?.tag_name.replace(/(\r\n|\n|\r| |\t)/gm, "")
)

// original function from main.js
const versionsMatch = (v1: string, v2: string) => {
  if (v1 === v2) {
    return true
  }
  let s1 = v1.split(".")
  let s2 = v2.split(".")
  // Check major version
  let n1 = parseInt(s1[0].substring(1, 2), 10)
  let n2 = parseInt(s2[0].substring(1, 2), 10)
  if (n1 < n2) return false
  if (n1 > n2) return true

  // Check minor version
  n1 = parseInt(s1[1], 10)
  n2 = parseInt(s2[1], 10)
  if (n1 < n2) return false
  if (n1 > n2) return true

  // Split patch: format could be e.g. 0-22-nightly
  s1 = s1[2].split("-")
  s2 = s2[2].split("-")

  n1 = parseInt(s1[0], 10)
  n2 = parseInt(s2[0], 10)
  if (n1 < n2) return false
  if (n1 > n2) return true

  n1 = (s1.length > 1) ? parseInt(s1[1], 10) : 0
  n2 = (s2.length > 1) ? parseInt(s2[1], 10) : 0
  if (n1 < n2) return false
  return true
}


interface Props {
  currentVersion: string
  releaseChannel: string
}
export const VersionControl = ({
  currentVersion,
  releaseChannel,
}: Props) => {
  const isStableReleaseChannel = releaseChannel === "stable"
  const [githubVersion] = useHtpp<GithubResponse>(
    NETDATA_LATEST_VERSION_URL,
    isStableReleaseChannel,
    true,
  )

  const [gcsVersionResponse] = useHtpp<{mediaLink: string}>(
    NETDATA_LATEST_GCS_VERSION_URL,
    !isStableReleaseChannel,
  )
  const [mediaLinkResponse] = useHtpp<string>(
    gcsVersionResponse?.mediaLink, Boolean(gcsVersionResponse),
  )

  // eslint-disable-next-line no-nested-ternary
  const latestVersion = isStableReleaseChannel
    ? transformGithubResponse(githubVersion)
    : mediaLinkResponse
      ? transformGcsVersionResponse(mediaLinkResponse)
      : null

  if (!latestVersion) {
    return null
  }
  const isNewVersionAvailable = !versionsMatch(currentVersion, latestVersion)
  return (
    <Container>
      <VersionIndicator>
        <CollapsableText>Agent Version</CollapsableText>
        <VersionNumber>{latestVersion}</VersionNumber>
      </VersionIndicator>
      {isNewVersionAvailable && (
        <NewVersionIndicator
          href="#"
          data-toggle="modal"
          data-target="#updateModal"
        >
          <StyledIcon name="logo_s" />
          <TextBold> New version avaliable </TextBold>
        </NewVersionIndicator>
      )}
    </Container>
  )
}
