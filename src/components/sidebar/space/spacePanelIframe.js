import React, { useRef, useEffect } from "react"
import { Flex } from "@netdata/netdata-ui"
import { useSelector } from "store/redux-separate-context"
import { sendToChildIframe, useListenToPostMessage } from "@/src/utils/post-message"
import { getIframeSrc } from "@/src/utils"
import { selectCloudBaseUrl } from "domains/global/selectors"

const SpacePanelIframe = ({ parentNode, replicatedNodes }) => {
  const cloudBaseURL = useSelector(selectCloudBaseUrl)

  const ref = useRef()

  const [spacePanelMessage] = useListenToPostMessage("hello-from-space-panel")

  useEffect(() => {
    if (!spacePanelMessage || !ref.current) return
    sendToChildIframe(ref.current, {
      type: "streamed-hosts-data",
      payload: { parentNode, replicatedNodes },
    })
  }, [replicatedNodes, parentNode, spacePanelMessage])

  return (
    <Flex
      ref={ref}
      as="iframe"
      src={getIframeSrc(cloudBaseURL, "space-panel")}
      title="space panel"
      width="100%"
      height="100%"
      border={{ side: "all", size: "0px" }}
    />
  )
}

export default SpacePanelIframe
