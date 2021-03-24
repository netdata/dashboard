import React from "react"
import { Flex } from "@netdata/netdata-ui"
import { useSelector } from "store/redux-separate-context"
import { selectCloudBaseUrl } from "domains/global/selectors"
import { getIframeSrc } from "utils/utils"

const SpacesIframe = () => {
  const cloudBaseURL = useSelector(selectCloudBaseUrl)
  return (
    <Flex
      as="iframe"
      src={getIframeSrc(cloudBaseURL, "space-bar")}
      title="Space Bar"
      height="100%"
      width="100%"
      border={{ side: "all", size: "0px" }}
      overflow="hidden"
    />
  )
}

export default SpacesIframe
