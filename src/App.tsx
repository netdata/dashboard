import React, { useEffect, useRef, useState } from "react"
import Ps from "perfect-scrollbar"

// intentionally loading before bootstrap styles
import "./styles/main.css"

// needs to be included before bootstrap
import "domains/chart/utils/jquery-loader"
import "bootstrap"
import "bootstrap-toggle"
import "bootstrap-toggle/css/bootstrap-toggle.min.css"

import { loadCss } from "utils/css-loader"
import { Portals } from "domains/chart/components/portals"
import { TEMPORARY_MAIN_JS_TIMEOUT } from "domains/global/constants"
import { useRegistry } from "hooks/use-registry"
import { useAlarms } from "hooks/use-alarms"

import "./types/global"

import {
  netdataCallback,
} from "./main"
// @ts-ignore
import "./dashboard_info"

if (!window.netdataNoFontAwesome) {
  // @ts-ignore
  import("vendor/fontawesome-all-5.0.1.min")
}

// support legacy code
window.Ps = Ps

loadCss(window.NETDATA.themes.current.bootstrap_css)
loadCss(window.NETDATA.themes.current.dashboard_css)


const App: React.FC = () => { // eslint-disable-line arrow-body-style
  useEffect(() => {
    // todo
    // @ts-ignore
    window.NETDATA.alarms = {}
    // @ts-ignore
    window.NETDATA.pause = (callback) => {
      callback()
    }
    setTimeout(() => {
      // delay after loading bootstrap
      // todo quick hack for main.js - of course that cannot make production
      netdataCallback()
    }, TEMPORARY_MAIN_JS_TIMEOUT)
  }, [])
  const [refreshHelper, setRefreshHelper] = useState()
  const parseDom = useRef(() => {
    setRefreshHelper(Math.random())
  })

  useRegistry(true)
  useAlarms(true)

  // @ts-ignore
  window.NETDATA.parseDom = parseDom.current
  return (
    <div className="App">
      <Portals key={refreshHelper} />
    </div>
  )
}

export default App
