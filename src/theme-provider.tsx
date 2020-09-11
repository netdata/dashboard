import React, { useEffect, PropsWithChildren } from "react"
import { ThemeProvider } from "styled-components"
import { DefaultTheme, DarkTheme, BlueTheme } from "@netdata/netdata-ui"

import "./types/global"

import { GlobalColors } from "./global.colors"

const dashboardThemes: { [k: string]: "white" | "slate" } = {
  unspecified: "white",
  light: "white",
  dark: "slate",
  blue: "slate",
}

const uiKitThemes: { [k: string]: any } = {
  unspecified: DefaultTheme,
  light: DefaultTheme,
  dark: DarkTheme,
  blue: BlueTheme,
}

export const DashboardThemeProvider = ({
  theme = "unspecified",
  children,
}: PropsWithChildren<{ theme: string }>) => {
  useEffect(() => {
    window.netdataTheme = dashboardThemes[theme]
    window.NETDATA.updateTheme()
  }, [theme])

  return (
    <ThemeProvider theme={uiKitThemes[theme]}>
      <GlobalColors />
      {children}
    </ThemeProvider>
  )
}
