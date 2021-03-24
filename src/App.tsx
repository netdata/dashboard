import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
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
import "@fortawesome/fontawesome-free/js/all"

import "styles/fonts.css"
import { loadCss } from "utils/css-loader"
import { useDateTime } from "utils/date-time"
import { useSelector } from "store/redux-separate-context"
import {
  selectCloudBaseUrl,
  selectHasFetchedInfo,
  selectTheme,
} from "domains/global/selectors"
import { Portals } from "domains/chart/components/portals"
import { useChartsMetadata } from "domains/dashboard/hooks/use-charts-metadata"
import { PrintModal } from "domains/dashboard/components/print-modal"
import { SidebarSocialMedia } from "domains/dashboard/components/sidebar-social-media"
import { SidebarSocialMediaPortal } from "domains/dashboard/components/sidebar-social-media-portal"
import { isPrintMode } from "domains/dashboard/utils/parse-url"
import useAlarmFromUrl from "domains/dashboard/hooks/useAlarmFromUrl"
import { useRegistry } from "hooks/use-registry"
import { useAlarms } from "hooks/use-alarms"
import { NotificationsContainer } from "components/notifications-container"

import Layout from "components/layout"

import "./types/global"

import { useInfo } from "hooks/use-info"
import { serverStatic } from "utils/server-detection"
import { mapTheme } from "utils/map-theme"
import { netdataCallback, updateLocaleFunctions } from "./main"

// support legacy code
window.Ps = Ps


const App: React.FC = () => {
  const store = useStore()
  useEffect(() => {
    // todo
    // @ts-ignore
    window.NETDATA.alarms = {}
    // @ts-ignore
    window.NETDATA.pause = callback => {
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

  const hasFetchedInfo = useSelector(selectHasFetchedInfo)
  const theme = useSelector(selectTheme)
  useAlarmFromUrl()


  return (
    <ThemeProvider theme={mapTheme(theme)}>
      {hasFetchDependencies && (
        // this needs to render after dynamic css files are loaded, otherwise netdata-ui
        // styling will have smaller priority than bootstrap css
        <NotificationsContainer />
      )}
      {chartsMetadata && cloudBaseURL && hasFetchedInfo && (
        <Layout printMode={isPrintMode}>
          {hasFetchDependencies && haveDOMReadyForParsing && (
            <>
              <Portals key={refreshHelper} />
              <SidebarSocialMediaPortal>
                <SidebarSocialMedia />
              </SidebarSocialMediaPortal>
              {isPrintMode && <PrintModal />}
            </>
          )}
        </Layout>
      )}
    </ThemeProvider>
  )
}

export default App
