import React, { useCallback } from "react"
import { createSelector } from "reselect"
import { useSelector } from "store/redux-separate-context"
import { selectChartData } from "domains/chart/selectors"
import { DimensionLabel } from "./chart-legend-bottom.styled"

const emptyObject = {}

const selector = createSelector(
  selectChartData,
  ({ dimension_names: dimensionNames, keys = emptyObject }) => ({
    dimensionNames,
    keys,
  })
)

const LegendText = ({ id, index }) => {
  const { dimensionNames, keys } = useSelector(useCallback(state => selector(state, { id }), [id]))
  const { chart, node } = keys

  if (chart && node && Object.keys(keys).length === 2) {
    return (
      <DimensionLabel>
        {chart[index]}@{node[index]}
      </DimensionLabel>
    )
  }

  const name = dimensionNames[index]

  return <DimensionLabel>{name}</DimensionLabel>
}

export default LegendText
