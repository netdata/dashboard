import { DefaultTheme, DarkTheme } from "@netdata/netdata-ui"

import { DashboardTheme } from "utils/map-theme"

interface ThemeOptions {
  [index: string]: string
}

export const themeOptions: { [index in DashboardTheme]: ThemeOptions } = {
  white: {
    background: DefaultTheme.colors.mainBackground,
    surface: DefaultTheme.colors.mainBackground,
    primary: DefaultTheme.colors.primary,
    secondary: DefaultTheme.colors.accent,
    error: DefaultTheme.colors.error,
    onPrimary: DefaultTheme.colors.bright,
    onSecondary: DefaultTheme.colors.bright,
    onSurface: DefaultTheme.colors.text,
    onError: DefaultTheme.colors.bright,
    dupaDupa: "#ff00ff",
    textPrimaryOnBackground: DefaultTheme.colors.text,
    textSecondaryOnBackground: DefaultTheme.colors.textFocus,
    textHintOnBackground: DefaultTheme.colors.text,
    textDisabledOnBackground: DefaultTheme.colors.disabled,
    textIconOnBackground: DefaultTheme.colors.text,
    textPrimaryOnLight: DarkTheme.colors.text,
    textSecondaryOnLight: DarkTheme.colors.textFocus,
    textHintOnLight: DarkTheme.colors.text,
    textDisabledOnLight: DarkTheme.colors.disabled,
    textIconOnLight: DarkTheme.colors.text,
    textPrimaryOnDark: DefaultTheme.colors.text,
    textSecondaryOnDark: DefaultTheme.colors.textFocus,
    textHintOnDark: DefaultTheme.colors.text,
    textDisabledOnDark: DefaultTheme.colors.disabled,
    textIconOnDark: DefaultTheme.colors.text,
  },
  slate: {
    background: DarkTheme.colors.mainBackground,
    surface: DarkTheme.colors.mainBackground,
    primary: DarkTheme.colors.primary,
    secondary: DarkTheme.colors.accent,
    error: DarkTheme.colors.error,
    onPrimary: DarkTheme.colors.bright,
    onSecondary: DarkTheme.colors.bright,
    onSurface: DarkTheme.colors.text,
    onError: DarkTheme.colors.bright,
    textPrimaryOnBackground: DarkTheme.colors.text,
    textSecondaryOnBackground: DarkTheme.colors.textFocus,
    textHintOnBackground: DarkTheme.colors.text,
    textDisabledOnBackground: DarkTheme.colors.disabled,
    textIconOnBackground: DarkTheme.colors.text,
    textPrimaryOnLight: DefaultTheme.colors.text,
    textSecondaryOnLight: DefaultTheme.colors.textFocus,
    textHintOnLight: DefaultTheme.colors.text,
    textDisabledOnLight: DefaultTheme.colors.disabled,
    textIconOnLight: DefaultTheme.colors.text,
    textPrimaryOnDark: DarkTheme.colors.text,
    textSecondaryOnDark: DarkTheme.colors.textFocus,
    textHintOnDark: DarkTheme.colors.text,
    textDisabledOnDark: DarkTheme.colors.disabled,
    textIconOnDark: DarkTheme.colors.text,
  },
}
