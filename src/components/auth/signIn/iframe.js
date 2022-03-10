import React, { useCallback, useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { useSelector, useDispatch } from "store/redux-separate-context"
import { useLocalStorage } from "react-use"
import { Flex } from "@netdata/netdata-ui"
import { sendToChildIframe, useListenToPostMessage } from "utils/post-message"
import { getIframeSrc, NETDATA_REGISTRY_SERVER } from "utils/utils"
import useUserNodeAccessMessage from "hooks/use-user-node-access"
import { selectRegistry, selectCloudBaseUrl } from "domains/global/selectors"
import { LOCAL_STORAGE_NEEDS_SYNC } from "domains/dashboard/sagas"
import { setOfflineAction } from "@/src/domains/dashboard/actions"
import { SIGN_IN_IFRAME_ID } from "components/header/constants"

const IframeContainer = styled(Flex).attrs({ position: "absolute" })`
  display: none;
`
const Iframe = ({ signedIn }) => {
  const [rendered, setRendered] = useState(false)
  const signInMsg = useRef()
  const ref = useRef()

  const [lsValue, , removeLsValue] = useLocalStorage(LOCAL_STORAGE_NEEDS_SYNC)
  const cloudBaseURL = useSelector(selectCloudBaseUrl)
  const registry = useSelector(selectRegistry)

  const dispatch = useDispatch()

  const { origin, pathname } = window.location
  const nameParam = encodeURIComponent(registry.hostname)
  const originParam = encodeURIComponent(origin + pathname)

  const signInIframeUrl = getIframeSrc(
    cloudBaseURL,
    `sign-in?id=${registry.machineGuid}&name=${nameParam}&origin=${originParam}`
  )

  useListenToPostMessage("hello-from-sign-in", msg => {
    signInMsg.current = msg
  })

  useUserNodeAccessMessage()

  const onLoad = useCallback(() => {
    setRendered(true)
    setTimeout(() => dispatch(setOfflineAction({ offline: signInMsg.current === undefined })), 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handler = e => {
      if (!e?.target) return
      if (e.target.src === signInIframeUrl && !rendered) onLoad()
    }

    window.addEventListener("DOMFrameContentLoaded", handler)
    return () => window.removeEventListener("DOMFrameContentLoaded", handler)
  }, [signInIframeUrl, rendered, onLoad])

  useEffect(() => {
    if (!signedIn || !ref.current) return
    if (!registry.registryServer || registry.registryServer === NETDATA_REGISTRY_SERVER) return
    if (!lsValue) return

    removeLsValue()

    const { registryMachinesArray } = registry
    if (registryMachinesArray && registryMachinesArray.length > 0) {
      sendToChildIframe(ref.current, {
        type: "synced-private-registry",
        payload: registryMachinesArray,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn, registry, lsValue])

  return (
    <IframeContainer as="iframe" id={SIGN_IN_IFRAME_ID} src={signInIframeUrl} onLoad={onLoad} />
  )
}

export default Iframe
