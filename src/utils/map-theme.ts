import { DefaultTheme, DarkTheme } from "@netdata/netdata-ui"

export type DashboardTheme = "white" | "slate"

export const mapTheme = (theme: DashboardTheme) => ({
  slate: DarkTheme,
  white: DefaultTheme,
})[theme] || DarkTheme
