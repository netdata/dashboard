import React, { useLayoutEffect, useRef, useState } from "react"
import { Flex } from "@netdata/netdata-ui"
import { DashboardThemeProvider } from "@/src/theme-provider"
import { DashboardMenuProvider } from "@/src/domains/charts"
import CSSVariables from "./cssVariables"

export const ContentWrapper = props => (
  <Flex
    column
    height="100%"
    padding={[2, 0, 2, 4]}
    overflow={{ horizontal: "hidden" }}
    className="node-view__container"
    {...props}
  />
)

const Provider = ({
  dashboardAttributes,
  onAttributesChange,
  getChartAttributes,
  getChart,
  chartIds,
  theme,
  hasKubernetes,
  composite,
  children,
}) => {
  const ref = useRef()
  const [element, setElement] = useState()

  useLayoutEffect(() => {
    setElement(ref.current)
  }, [])

  return (
    <Flex flex ref={ref} height="100%" overflow="auto">
      {element && (
        <CSSVariables>
          <DashboardThemeProvider theme={theme}>
            <DashboardMenuProvider
              container={element}
              chartIds={chartIds}
              getChart={getChart}
              getChartAttributes={getChartAttributes}
              onAttributesChange={onAttributesChange}
              dashboardAttributes={dashboardAttributes}
              hasKubernetes={hasKubernetes}
              composite={composite}
            >
              {children}
            </DashboardMenuProvider>
          </DashboardThemeProvider>
        </CSSVariables>
      )}
    </Flex>
  )
}

export default Provider
