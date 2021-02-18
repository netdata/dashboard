import React, { createContext, useContext } from "react"

export const ChartsContext = createContext({})
export const GetChartContext = createContext({})

export const ChartsProvider = ({ charts, getChart, children }) => (
  <GetChartContext.Provider value={getChart}>
    <ChartsContext.Provider value={charts}>{children}</ChartsContext.Provider>
  </GetChartContext.Provider>
)

export const withChart = Component => ({ id, ...rest }) => {
  const charts = useContext(ChartsContext)
  const getChart = useContext(GetChartContext)
  return <Component chart={charts[id] || getChart(id)} {...rest} />
}
