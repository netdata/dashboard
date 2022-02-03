import React from "react"
import { identity } from "ramda"
import { createContext } from "use-context-selector"
import useContext from "@/src/hooks/useContextSelector"

// id
// chartId
// link
// chartLibrary
// width
// forceTimeWindow
// info
// height
// dygraphValueRange
// heightId
// colors
// decimalDigits

export const ContainerContext = React.createContext({})
export const GetChartContext = createContext({})
export const MenuChartsAttributeById = createContext({})
export const DashboardAttributesContext = createContext({})

export const ChartsProvider = ({
  container,
  menuChartsAttributeById,
  getChart,
  dashboardAttributes,
  children,
}) => (
  <ContainerContext.Provider value={container}>
    <DashboardAttributesContext.Provider value={dashboardAttributes}>
      <GetChartContext.Provider value={getChart}>
        <MenuChartsAttributeById.Provider value={menuChartsAttributeById}>
          {children}
        </MenuChartsAttributeById.Provider>
      </GetChartContext.Provider>
    </DashboardAttributesContext.Provider>
  </ContainerContext.Provider>
)

const emptyObject = {}

export const useMenuChartAttributes = (id, selector = identity) =>
  useContext(MenuChartsAttributeById, state => selector(state[id] || emptyObject))

export const useContainer = () => React.useContext(ContainerContext)

export const useDashboardAttributes = (selector = identity) =>
  useContext(DashboardAttributesContext, selector)

export const withChartHeadProps = Component => ({ id, ...rest }) => {
  const menuChartAttributes = useMenuChartAttributes(id)
  const { chartId } = menuChartAttributes
  const chart = useChart(chartId)
  const dashboardAttributes = useDashboardAttributes()

  return (
    <Component
      id={id}
      chart={chart}
      menuChartAttributes={menuChartAttributes}
      dashboardAttributes={dashboardAttributes}
      {...rest}
    />
  )
}

export const useGetChart = () => useContext(GetChartContext)

export const useChart = (id, selector = identity) => {
  const getChart = useGetChart()
  const resource = getChart(id) || emptyObject
  return selector(resource)
}

export const withChartProps = Component => ({ id, ...rest }) => {
  const menuChartAttributes = useMenuChartAttributes(id)
  const { chartId } = menuChartAttributes
  const chart = useChart(chartId)

  return <Component id={id} chart={chart} menuChartAttributes={menuChartAttributes} {...rest} />
}

export const withChart = (Component, selector) => ({ id, ...rest }) => {
  const chart = useChart(id, selector)
  return <Component {...chart} {...rest} />
}

export const withMenuChartAttributes = (Component, selector) => ({ id, ...rest }) => {
  const menuChartsAttributes = useMenuChartAttributes(id, selector)
  return <Component {...menuChartsAttributes} {...rest} />
}
