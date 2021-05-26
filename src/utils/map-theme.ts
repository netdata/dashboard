import { DefaultTheme, DarkTheme } from "@netdata/netdata-ui"

export type DashboardTheme = any

export const mapTheme = (theme: DashboardTheme): any =>
  ({
    slate: DarkTheme,
    white: DefaultTheme,
  }[theme] || DarkTheme)
