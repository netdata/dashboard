import { ThemeProvider } from "@rmwc/theme"
import React from "react"
import { themeOptions } from "services/ui-service/ui-theming"
import { useSelector } from "store/redux-separate-context"
import { selectTheme } from "domains/global/selectors"

interface Props {
  children: React.ReactNode | React.ReactNode[]
}

export const RMWCThemeProvider = ({ children }: Props) => {
  const theme = useSelector(selectTheme)
  return <ThemeProvider options={themeOptions[theme]}>{children}</ThemeProvider>
}

export const withRMWCThemeProvider = (Component: any) => (props: any) => (
  <RMWCThemeProvider>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Component {...props} />
  </RMWCThemeProvider>
)
