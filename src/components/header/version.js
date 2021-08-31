import React from "react"
import VersionControl from "components/app-header/components/versionControl"
import { useSelector } from "@/src/store/redux-separate-context"

const versionSelector = state => {
  const { data } = state.global.chartsMetadata

  if (!data) return null

  const { version, release_channel: releaseChannel } = data
  return {
    version,
    releaseChannel,
  }
}

const Version = () => {
  const data = useSelector(versionSelector)
  return (
    data && <VersionControl currentVersion={data.version} releaseChannel={data.releaseChannel} />
  )
}

export default Version
