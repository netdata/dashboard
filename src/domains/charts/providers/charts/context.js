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
export const GetChartAttributesContext = createContext({})
export const DispatchChartAttributesContext = createContext({})
export const MenuChartsAttributesContext = createContext({})
export const DashboardAttributesContext = createContext({})
export const ListContext = createContext(null)

export const ChartsProvider = ({
  container,
  menuChartsAttributes,
  getChartAttributes,
  onAttributesChange,
  getChart,
  dashboardAttributes,
  children,
}) => (
  <ContainerContext.Provider value={container}>
    <DashboardAttributesContext.Provider value={dashboardAttributes}>
      <GetChartContext.Provider value={getChart}>
        <MenuChartsAttributesContext.Provider value={menuChartsAttributes}>
          <GetChartAttributesContext.Provider value={getChartAttributes}>
            <DispatchChartAttributesContext.Provider value={onAttributesChange}>
              {children}
            </DispatchChartAttributesContext.Provider>
          </GetChartAttributesContext.Provider>
        </MenuChartsAttributesContext.Provider>
      </GetChartContext.Provider>
    </DashboardAttributesContext.Provider>
  </ContainerContext.Provider>
)

export const useMenuChartAttributes = (id, selector = identity) =>
  useContext(MenuChartsAttributesContext, state => selector(state[id]))

export const useDispatchChartsAttributes = () => useContext(DispatchChartAttributesContext)

export const useDispatchChartAttributes = id => {
  const dispatchChartAttributes = useDispatchChartsAttributes()
  return values => dispatchChartAttributes(state => ({ ...state, [id]: values }))
}

export const useContainer = () => React.useContext(ContainerContext)

export const useDashboardAttributes = (selector = identity) =>
  useContext(DashboardAttributesContext, selector)

export const useGetChart = () => useContext(GetChartContext)

export const useChart = (id, selector = identity) => {
  const getChart = useGetChart()
  const resource = getChart(id)
  return selector(resource)
}

export const useGetChartAttributes = () => useContext(GetChartAttributesContext)

export const useChartAttributes = (id, selector = identity) => {
  const getChartAttributes = useGetChartAttributes()
  const resource = getChartAttributes(id)
  return selector(resource)
}

export const withChartProps = Component => ({ id, ...rest }) => {
  const menuChartAttributes = useMenuChartAttributes(id)
  const { chartId } = menuChartAttributes
  const chart = useChart(chartId)
  const chartAttributes = useChartAttributes(chartId)

  return (
    <Component
      id={id}
      chart={chart}
      menuChartAttributes={menuChartAttributes}
      chartAttributes={chartAttributes}
      {...rest}
    />
  )
}

export const withChart = (Component, selector) => ({ id, ...rest }) => {
  const chart = useChart(id, selector)
  return <Component {...chart} {...rest} />
}

export const withMenuChartAttributes = (Component, selector) => ({ id, ...rest }) => {
  const menuChartsAttributes = useMenuChartAttributes(id, selector)
  return <Component {...menuChartsAttributes} {...rest} />
}
