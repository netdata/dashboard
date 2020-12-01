import React from "react"
import Ps from "perfect-scrollbar"
import { ThemeProvider } from "styled-components"

import { loadCss } from "utils/css-loader"
import { mapTheme } from "utils/map-theme"
import "domains/chart/utils/jquery-loader"
import { Portals } from "domains/chart/components/portals"
import { useRegistry } from "hooks/use-registry"
import { useAlarms } from "hooks/use-alarms"
import { useSelector } from "store/redux-separate-context"
import { selectTheme } from "domains/global/selectors"

import "./types/global"

if (!window.netdataNoBootstrap) {
  // it needs to be imported indirectly, there's probably a bug in webpack
  import("dynamic-imports/bootstrap")
}

if (!window.netdataNoFontAwesome) {
  // @ts-ignore
  import("vendor/fontawesome-all-5.0.1.min")
}

// support legacy code
window.Ps = Ps

loadCss(window.NETDATA.themes.current.bootstrap_css)
loadCss(window.NETDATA.themes.current.dashboard_css)

const CustomDashboardsApp: React.FC = () => { // eslint-disable-line arrow-body-style
  const shouldUseRegistry = window.netdataRegistry === true
  useRegistry(shouldUseRegistry)

  // backwards-compatibility: in old dashboard any truthy window.netdataShowAlarms was enough
  // but window.netdataRegistry needed to be explicitly `true`
  const shouldUseAlarms = !!window.netdataShowAlarms
  useAlarms(shouldUseAlarms)

  const theme = useSelector(selectTheme)

  return (
    <ThemeProvider theme={mapTheme(theme)}>
      <div className="App">
        <Portals />
      </div>
    </ThemeProvider>
  )
}

export default CustomDashboardsApp
