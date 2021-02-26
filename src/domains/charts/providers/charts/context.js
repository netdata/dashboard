import React, { createContext, useContext } from "react"

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

export const ContainerContext = createContext({})
export const GetChartContext = createContext({})
export const GetChartAttributesContext = createContext({})
export const DispatchChartAttributesContext = createContext({})
export const MenuChartsAttributesContext = createContext({})
export const DashboardAttributesContext = createContext({})

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

export const useMenuChartAttributes = (id, key) => {
  const resource = useContext(MenuChartsAttributesContext)[id]
  return key ? resource[key] : resource
}

export const useDispatchChartsAttributes = () => useContext(DispatchChartAttributesContext)

export const useDispatchChartAttributes = id => {
  const dispatchChartAttributes = useDispatchChartsAttributes()
  return values => dispatchChartAttributes(state => ({ ...state, [id]: values }))
}

export const useContainer = () => useContext(ContainerContext)

export const useDashboardAttributes = () => useContext(DashboardAttributesContext)

export const useGetChart = () => useContext(GetChartContext)

export const useChart = (id, key) => {
  const getChart = useGetChart()
  const resource = getChart(id)
  return key ? resource[key] : resource
}

export const useChartAttributes = (id, key) => {
  const getChartAttributes = useContext(GetChartAttributesContext)
  const resource = getChartAttributes(id)
  return key ? resource[key] : resource
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

export const withChart = (Component, key) => ({ id, ...rest }) => {
  const chart = useChart(id, key)
  return <Component {...(key ? { [key]: chart } : chart)} {...rest} />
}

export const withMenuChartAttributes = (Component, key) => ({ id, ...rest }) => {
  const menuChartsAttributes = useMenuChartAttributes(id, key)
  return <Component {...(key ? { [key]: menuChartsAttributes } : menuChartsAttributes)} {...rest} />
}
