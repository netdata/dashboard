import React, { PropsWithChildren } from "react"
import { ThemeProvider } from "styled-components"
import { DefaultTheme, DarkTheme, BlueTheme } from "@netdata/netdata-ui"

import "./types/global"

import { GlobalColors } from "./global.colors"

const dashboardThemes: { [k: string]: "white" | "slate" } = {
  unspecified: "slate",
  light: "white",
  dark: "slate",
  blue: "slate",
}

const uiKitThemes: { [k: string]: any } = {
  unspecified: DarkTheme,
  light: DefaultTheme,
  dark: DarkTheme,
  blue: BlueTheme,
}

export const DashboardThemeProvider = ({
  theme = "unspecified",
  children,
}: PropsWithChildren<{ theme: string }>) => {
  window.netdataTheme = dashboardThemes[theme]
  window.NETDATA.updateTheme()

  return (
    <ThemeProvider theme={uiKitThemes[theme]}>
      <GlobalColors />
      {children}
    </ThemeProvider>
  )
}
