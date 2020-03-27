import React, {
  useEffect, useLayoutEffect, useRef, useState,
} from "react"
import Ps from "perfect-scrollbar"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
import { Portals } from "domains/chart/components/portals"
import { PrintModal } from "domains/dashboard/components/print-modal"
import { isPrintMode } from "domains/dashboard/utils/parse-url"
import { useRegistry } from "hooks/use-registry"
import { useAlarms } from "hooks/use-alarms"

import "./types/global"

import { useInfo } from "hooks/use-info"
import { serverStatic } from "utils/server-detection"
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

const App: React.FC = () => { // eslint-disable-line arrow-body-style
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

  // @ts-ignore
  window.NETDATA.parseDom = parseDom.current

  return (
    <div className="App">
      {hasFetchDependencies && haveDOMReadyForParsing && (
        <>
          <ToastContainer />
          <Portals key={refreshHelper} />
          {isPrintMode && <PrintModal />}
        </>
      )}
    </div>
  )
}

export default App
