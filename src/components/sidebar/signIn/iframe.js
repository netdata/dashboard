import React, { useCallback, useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { useSelector } from "store/redux-separate-context"
import { useLocalStorage } from "react-use"
import { Flex } from "@netdata/netdata-ui"
import { sendToChildIframe, useListenToPostMessage } from "utils/post-message"
import { getIframeSrc, NETDATA_REGISTRY_SERVER } from "utils/utils"
import { selectRegistry, selectCloudBaseUrl } from "domains/global/selectors"
import { LOCAL_STORAGE_NEEDS_SYNC } from "domains/dashboard/sagas"

const IframeContainer = styled(Flex).attrs({ position: "absolute" })`
  display: none;
`
const Iframe = ({ signedIn, setOffline }) => {
  const [lsValue, , removeLsValue] = useLocalStorage(LOCAL_STORAGE_NEEDS_SYNC)
  const [rendered, setRendered] = useState(false)
  const ref = useRef()

  const cloudBaseURL = useSelector(selectCloudBaseUrl)
  const registry = useSelector(selectRegistry)

  const { origin, pathname } = window.location
  const nameParam = encodeURIComponent(registry.hostname)
  const originParam = encodeURIComponent(origin + pathname)

  const signInIframeUrl = getIframeSrc(
    cloudBaseURL,
    `sign-in?id=${registry.machineGuid}&name=${nameParam}&origin=${originParam}`
  )

  const [helloFromSignIn] = useListenToPostMessage("hello-from-sign-in")
  const signInRef = useRef(helloFromSignIn)

  useEffect(() => {
    signInRef.current = helloFromSignIn
  }, [helloFromSignIn])

  const onLoad = useCallback(() => {
    setRendered(true)
    setTimeout(() => {
      if (signInRef.current === undefined) setOffline(true)
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOffline])

  const handler = useCallback(
    e => {
      if (!e?.target) return
      if (e.target.src === signInIframeUrl && !rendered) onLoad()
    },
    [signInIframeUrl, rendered, onLoad]
  )

  useEffect(() => {
    window.addEventListener("DOMFrameContentLoaded", handler)
    return () => window.removeEventListener("DOMFrameContentLoaded", handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  return <IframeContainer as="iframe" src={signInIframeUrl} onLoad={onLoad} />
}

export default Iframe
