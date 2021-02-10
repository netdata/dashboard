import React, {
  useEffect, useLayoutEffect, useRef, useState, useCallback,
} from "react"
import Ps from "perfect-scrollbar"
import { ThemeProvider } from "styled-components"

import "@material/menu-surface/dist/mdc.menu-surface.css"

// intentionally loading before bootstrap styles
import "./styles/main.css"

// needs to be included before bootstrap
import "domains/chart/utils/jquery-loader"
import "bootstrap"
import "bootstrap-toggle"
import "bootstrap-toggle/css/bootstrap-toggle.min.css"

import { useStore } from "react-redux"
import "typeface-ibm-plex-sans"

import "styles/fonts.css"
import { loadCss } from "utils/css-loader"
import { useDateTime } from "utils/date-time"
import { useListenToPostMessage } from "utils/post-message"
import { useSelector } from "store/redux-separate-context"
import {
  selectCloudBaseUrl,
  selectHasFetchedInfo,
  selectSignInUrl,
  selectTheme,
} from "domains/global/selectors"
import { Portals } from "domains/chart/components/portals"
import { useChartsMetadata } from "domains/dashboard/hooks/use-charts-metadata"
import { DatePickerContainer } from "domains/dashboard/components/date-picker-container"
import { PrintModal } from "domains/dashboard/components/print-modal"
import { SidebarSocialMedia } from "domains/dashboard/components/sidebar-social-media"
import { SidebarSocialMediaPortal } from "domains/dashboard/components/sidebar-social-media-portal"
import { isPrintMode } from "domains/dashboard/utils/parse-url"
import { useRegistry } from "hooks/use-registry"
import { useListenToFocusMessages } from "hooks/use-listen-to-focus-messages"
import { useAlarms } from "hooks/use-alarms"
import { AppHeader } from "components/app-header"
import { SpacesBar } from "components/spaces-bar"
import { SpacePanel } from "components/space-panel"
import { NotificationsContainer } from "components/notifications-container"

import "./types/global"

import { useInfo } from "hooks/use-info"
import { serverStatic } from "utils/server-detection"
import { mapTheme } from "utils/map-theme"
import {
  netdataCallback,
  updateLocaleFunctions,
} from "./main"
import { GlobalColors } from "./global.colors"

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
  useInfo(true)

  const [hasFetchDependencies, setHasFetchDependencies] = useState(false)
  useLayoutEffect(() => {
    Promise.all([
      loadCss(serverStatic + window.NETDATA.themes.current.bootstrap_css),
      loadCss(serverStatic + window.NETDATA.themes.current.dashboard_css),
    ]).then(() => {
      setHasFetchDependencies(true)
    })
  }, [])

  const chartsMetadata = useChartsMetadata()
  const cloudBaseURL = useSelector(selectCloudBaseUrl)

  // @ts-ignore
  window.NETDATA.parseDom = parseDom.current

  const [hasSignInHistory, setHasSignInHistory] = useState(
    localStorage.getItem(HAS_SIGN_IN_HISTORY) === "true",
  )
  const isSignedInCallback = useCallback((newIsSignedIn) => {
    if (newIsSignedIn === true) {
      setHasSignInHistory(true)
      localStorage.setItem(HAS_SIGN_IN_HISTORY, "true")
    } else if (newIsSignedIn === false) {
      // logout
      setHasSignInHistory(false)
      localStorage.setItem(HAS_SIGN_IN_HISTORY, "false")
    }
  }, [])
  const [isSignedIn] = useListenToPostMessage("is-signed-in", isSignedInCallback)

  const [enoughWaitingForIframe, setEnoughWaitingForIframe] = useState(false)
  const handleEnoughWaitingForIframe = useCallback(() => {
    setEnoughWaitingForIframe(true)
  }, [])

  const [isOffline, setIsOffline] = useState(false)

  useListenToFocusMessages()
  const signInUrl = useSelector(selectSignInUrl)

  const hasFetchedInfo = useSelector(selectHasFetchedInfo)
  const theme = useSelector(selectTheme)

  return (
    <ThemeProvider theme={mapTheme(theme)}>
      <GlobalColors />
      {hasFetchDependencies && (
        // this needs to render after dynamic css files are loaded, otherwise netdata-ui
        // styling will have smaller priority than bootstrap css
        <NotificationsContainer />
      )}
      {chartsMetadata && cloudBaseURL && hasFetchedInfo && (
        <>
          {!isPrintMode && (
            <SpacesBar
              isOffline={isOffline}
              isSignedIn={isSignedIn}
              cloudBaseURL={cloudBaseURL}
              enoughWaitingForIframe={enoughWaitingForIframe}
              signInUrl={signInUrl}
            />
          )}
          {!isPrintMode && (
            <SpacePanel
              hasSignInHistory={hasSignInHistory}
              isOffline={isOffline}
              isSignedIn={isSignedIn}
              cloudBaseURL={cloudBaseURL}
              chartsMetadata={chartsMetadata}
              signInUrl={signInUrl}
            />
          )}
          <AppHeader
            chartsMetadata={chartsMetadata}
            cloudBaseURL={cloudBaseURL}
            isOffline={isOffline}
            isSignedIn={isSignedIn}
            enoughWaitingForIframe={enoughWaitingForIframe}
            hasSignInHistory={hasSignInHistory}
            onEnoughWaitingForIframe={handleEnoughWaitingForIframe}
            setIsOffline={setIsOffline}
            signInUrl={signInUrl}
          />
          <div className="App">
            {hasFetchDependencies && haveDOMReadyForParsing && (
              <>
                <Portals key={refreshHelper} />
                <DatePickerContainer />
                <SidebarSocialMediaPortal>
                  <SidebarSocialMedia />
                </SidebarSocialMediaPortal>
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
