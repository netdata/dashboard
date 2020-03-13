import React, { useEffect, useRef } from "react"

import { getIframeSrc } from "utils"
import { sendToChildIframe, useListenToPostMessage } from "utils/post-message"

interface Props {
  cloudBaseURL: string
  streamedHostsData: {
    masterNodeName: string
    masterNodeUrl: string
    streamedHosts: { hostname: string, url: string }[]
  }
}
export const SpacePanelIframe = ({
  cloudBaseURL,
  streamedHostsData,
}: Props) => {
  const [helloFromSpacePanel] = useListenToPostMessage("hello-from-space-panel")
  const spacePanelIframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (helloFromSpacePanel && spacePanelIframeRef.current) {
      sendToChildIframe(spacePanelIframeRef.current, {
        type: "streamed-hosts-data",
        payload: streamedHostsData,
      })
    }
  }, [helloFromSpacePanel, spacePanelIframeRef, streamedHostsData])

  return (
    <>
      <iframe
        ref={spacePanelIframeRef}
        title="space panel"
        src={getIframeSrc(cloudBaseURL, "space-panel")}
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </>
  )
}
