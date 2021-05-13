import React, { PropsWithChildren } from "react"
import { ThemeProvider } from "styled-components"
import { DefaultTheme, DarkTheme } from "@netdata/netdata-ui"

import "./types/global"

import { GlobalColors } from "./global.colors"

const dashboardThemes: { [k: string]: "white" | "slate" } = {
  unspecified: "slate",
  light: "white",
  dark: "slate",
}

const uiKitThemes: { [k: string]: any } = {
  unspecified: DarkTheme,
  light: DefaultTheme,
  dark: DarkTheme,
}

export const DashboardThemeProvider = ({
  theme = "unspecified",
  children,
}: PropsWithChildren<{ theme: string }>) => {
  window.netdataTheme = dashboardThemes[theme] || dashboardThemes.unspecified
  window.NETDATA.updateTheme()

  return (
    <ThemeProvider theme={uiKitThemes[theme] || uiKitThemes.unspecified}>
      <GlobalColors />
      {children}
    </ThemeProvider>
  )
}
