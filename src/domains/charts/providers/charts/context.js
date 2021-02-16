import React, { createContext } from "react"

export const ChartsContext = createContext({})
export const GetChartContext = createContext({})

export const ChartsProvider = ({ charts, getChart, children }) => (
  <GetChartContext.Provider value={getChart}>
    <ChartsContext.Provider value={charts}>{children}</ChartsContext.Provider>
  </GetChartContext.Provider>
)

export const ChartsConsumer = ({ id, children }) => (
  <GetChartContext>
    {getChart => (
      <ChartsContext.Consumer>
        {charts => children(charts[id] || getChart(id))}
      </ChartsContext.Consumer>
    )}
  </GetChartContext>
)
