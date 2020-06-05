import React, { useEffect, useState } from "react"
import Ps from "perfect-scrollbar"
import { ThemeProvider } from "styled-components"
import { DefaultTheme } from "@netdata/netdata-ui"

// this is for developing purposes only. Normally, cloud-FE already has those stylesheets
import "@material/menu-surface/dist/mdc.menu-surface.css"
import "@material/menu/dist/mdc.menu.css"

import { loadCss } from "utils/css-loader"
import "domains/chart/utils/jquery-loader"

import "./dashboard-react"

import "./types/global"
import { NodeView } from "domains/dashboard/components/node-view"

import { ChartsMetadata } from "domains/global/types"

import { axiosInstance } from "utils/api"

// import "./styles/main.css"

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

window.netdataTheme = "white"
// @ts-ignore
window.NETDATA.updateTheme()

// loadCss(window.NETDATA.themes.current.bootstrap_css)
loadCss(window.NETDATA.themes.current.dashboard_css)


if (window.netdataPrepCallback) {
  window.netdataPrepCallback()
}

const getCurrentRouteFromHash = () => document.location.hash.split(";")[0].replace("#", "")

const AppStyle = { height: "100vh" }

const NodeViewApp = () => { // eslint-disable-line arrow-body-style
  const [realMetadata, setRealMetadata] = useState()
  useEffect(() => {
    axiosInstance.get("http://localhost:19999/api/v1/charts")
      .then((response) => {
        if (response.data) {
          setRealMetadata(response.data)
        }
      })
  }, [])

  const [currentRoute, setCurrentRoute] = useState(getCurrentRouteFromHash)

  return (
    <ThemeProvider theme={DefaultTheme}>
      <div className="App" style={AppStyle}>
        {realMetadata && (
          <NodeView
            chartsMetadata={realMetadata as unknown as ChartsMetadata}
            currentChart={currentRoute}
            host="http://localhost:19999/api/v1/data"
            setCurrentChart={(chart: string) => {
              if (currentRoute !== chart) {
                setCurrentRoute(chart)
                window.history.replaceState(null, "", `#${chart}`)
              }
            }}
          />
        )}
      </div>
    </ThemeProvider>
  )
}

export default NodeViewApp
