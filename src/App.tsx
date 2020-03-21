import React, {
  useEffect, useLayoutEffect, useRef, useState, useCallback,
} from "react"
import Ps from "perfect-scrollbar"
import { ThemeProvider } from "styled-components"
import { DefaultTheme } from "@netdata/netdata-ui"

// intentionally loading before bootstrap styles
import "./styles/main.css"

// needs to be included before bootstrap
import "domains/chart/utils/jquery-loader"
import "bootstrap"
import "bootstrap-toggle"
import "bootstrap-toggle/css/bootstrap-toggle.min.css"

import { useStore } from "react-redux"

import { loadCss } from "utils/css-loader"
import { useDateTime } from "utils/date-time"
import { useListenToPostMessage } from "utils/post-message"
import { useSelector } from "store/redux-separate-context"
import { selectCloudBaseUrl } from "domains/global/selectors"
import { Portals } from "domains/chart/components/portals"
import { useChartsMetadata } from "domains/dashboard/hooks/use-charts-metadata"
import { PrintModal } from "domains/dashboard/components/print-modal"
import { isPrintMode } from "domains/dashboard/utils/parse-url"
import { useRegistry } from "hooks/use-registry"
import { useAlarms } from "hooks/use-alarms"
import { AppHeader } from "components/app-header"
import { SpacesBar } from "components/spaces-bar"
import { SpacePanel } from "components/space-panel"

import "./types/global"

import {
  netdataCallback,
  updateLocaleFunctions,
} from "./main"

if (!window.netdataNoFontAwesome) {
  // @ts-ignore
  import("vendor/fontawesome-all-5.0.1.min")
}

// support legacy code
window.Ps = Ps

const HAS_SIGN_IN_HISTORY = "has-sign-in-history"

const App: React.FC = () => {
  const store = useStore()
  useEffect(() => {
    // todo
    // @ts-ignore
    window.NETDATA.alarms = {}
    // @ts-ignore
    window.NETDATA.pause = (callback) => {
      callback()
    }
    netdataCallback(store)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [refreshHelper, setRefreshHelper] = useState<number>()
  // this is temporary, we will not need it when main.js will be fully refactored
  const haveDOMReadyForParsing = refreshHelper !== undefined
  // a workaround - each time parseDom is run, the portals are rerendered
  const parseDom = useRef(() => {
    setRefreshHelper(Math.random())
  })

  useEffect(() => {
    if (haveDOMReadyForParsing) {
      const loadOverlay = document.getElementById("loadOverlay")
      if (loadOverlay) {
        loadOverlay.style.display = "none"
      }
    }
  }, [haveDOMReadyForParsing])

  const { localeDateString, localeTimeString } = useDateTime()
  useEffect(() => {
    updateLocaleFunctions({
      localeDateString,
      localeTimeString,
    })
  }, [localeDateString, localeTimeString])

  useRegistry(true)
  useAlarms(true)

  const [hasFetchDependencies, setHasFetchDependencies] = useState(false)
  useLayoutEffect(() => {
    Promise.all([
      loadCss(window.NETDATA.themes.current.bootstrap_css),
      loadCss(window.NETDATA.themes.current.dashboard_css),
    ]).then(() => {
      setHasFetchDependencies(true)
    })
  }, [])

  const chartsMetadata = useChartsMetadata()
  const cloudBaseURL = useSelector(selectCloudBaseUrl)

  // @ts-ignore
  window.NETDATA.parseDom = parseDom.current

  const hasSignInHistory = localStorage.getItem(HAS_SIGN_IN_HISTORY) === "true"
  const isSignedInCallback = useCallback((newIsSignedIn) => {
    if (newIsSignedIn === true) {
      localStorage.setItem(HAS_SIGN_IN_HISTORY, "true")
    } else if (newIsSignedIn === false) {
      // logout
      localStorage.setItem(HAS_SIGN_IN_HISTORY, "false")
    }
  }, [])
  const [isSignedIn] = useListenToPostMessage("is-signed-in", isSignedInCallback)

  const [enoughWaitingForIframe, setEnoughWaitingForIframe] = useState(false)
  const handleEnoughWaitingForIframe = useCallback(() => {
    setEnoughWaitingForIframe(true)
  }, [])

  const [isOffline, setIsOffline] = useState(false)

  // const dispatch = useDispatch()
  // const [hasFocus] = useListenToPostMessage("has-focus", (newHasFocus) => {
  //   dispatch(windowFocusChangeAction({ hasWindowFocus: newHasFocus })
  // })

  return (
    <ThemeProvider theme={DefaultTheme}>
      {chartsMetadata && cloudBaseURL && (
        <>
          {!isPrintMode && (
            <SpacesBar
              isSignedIn={isSignedIn}
              cloudBaseURL={cloudBaseURL}
              enoughWaitingForIframe={enoughWaitingForIframe}
            />
          )}
          {!isPrintMode && (
            <SpacePanel
              hasSignInHistory={hasSignInHistory}
              isOffline={isOffline}
              isSignedIn={isSignedIn}
              cloudBaseURL={cloudBaseURL}
              chartsMetadata={chartsMetadata}
            />
          )}
          <AppHeader
            chartsMetadata={chartsMetadata}
            cloudBaseURL={cloudBaseURL}
            isSignedIn={isSignedIn}
            enoughWaitingForIframe={enoughWaitingForIframe}
            onEnoughWaitingForIframe={handleEnoughWaitingForIframe}
            setIsOffline={setIsOffline}
          />
          <div className="App">
            {hasFetchDependencies && haveDOMReadyForParsing && (
              <>
                <Portals key={refreshHelper} />
                {isPrintMode && <PrintModal />}
              </>
            )}
          </div>
        </>
      )}
    </ThemeProvider>
  )
}

export default App
