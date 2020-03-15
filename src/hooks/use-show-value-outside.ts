import { useEffect, useRef } from "react"
import { isEmpty } from "ramda"
import { useMount } from "react-use"

import { ChartData, DygraphData } from "domains/chart/chart-types"
import { Attributes } from "domains/chart/utils/transformDataAttributes"
import { ChartLibraryConfig } from "domains/chart/utils/chartLibrariesSettings"


interface UseShowValueOutsideArgument {
  attributes: Attributes
  chartData: ChartData
  chartSettings: ChartLibraryConfig
  hoveredRow: number
  legendFormatValue: ((v: number | string | null) => number | string)
  showUndefined: boolean
}

// example of the attribute:
// show-value-of-iowait-at: "system.cpu.iowait.1"

export const useShowValueOutside = ({
  attributes,
  chartData,
  chartSettings,
  hoveredRow,
  legendFormatValue,
  showUndefined,
}: UseShowValueOutsideArgument) => {
  // a ref to store found elements, just once per lifetime of component
  const showValueAttributesNodes = useRef<(HTMLElement | null)[]>([])

  // find the nodes that will have populated values
  useMount(() => {
    const { showValueOf } = attributes
    // showValueOf will be undefined if not used, but additional isEmpty check can prevent
    // regression performance issue in the future
    if (!showValueOf || isEmpty(showValueOf)) {
      return
    }
    const dimensionNames = chartData.dimension_names
    const dimensionIds = chartData.dimension_ids
    dimensionNames.forEach((dimensionName, i) => {
      const userElementId = showValueOf[`show-value-of-${dimensionName.toLowerCase()}`]
        || showValueOf[`show-value-of-${dimensionIds[i].toLowerCase()}-at`]

      // if element is not found, just add null
      showValueAttributesNodes.current = showValueAttributesNodes.current.concat(
        document.getElementById(userElementId),
      )
    })
  })

  useEffect(() => {
    if (showValueAttributesNodes.current.length) {
      const chartSettingCallOptions = chartSettings.options(attributes)
      const isFlipped = chartSettingCallOptions.includes("flip")

      // "objectrows" is for d3pie, which has different data format
      if (chartData.format === "json" && !chartSettingCallOptions.includes("objectrows")) {
        const { data } = (chartData as DygraphData).result
        const valueIndex = hoveredRow === -1
          ? (data.length - 1)
          : (hoveredRow) // because data for easy-pie-chart are flipped

        // yes, "flipped" value means chronological order (from oldest to newest) :)
        const rowIndex = isFlipped ? valueIndex : (data.length - valueIndex - 1)
        const row = data[rowIndex]

        chartData.dimension_names.forEach((dimensionName, dimensionIndex) => {
          const value = (showUndefined || !row)
            ? ""
            : legendFormatValue(row[dimensionIndex + 1])
          const element = showValueAttributesNodes.current[dimensionIndex]
          if (element) {
            element.innerText = `${value}`
          }
        })
      }
    }
  }, [attributes, chartData, chartSettings, hoveredRow, legendFormatValue, showUndefined])
}
