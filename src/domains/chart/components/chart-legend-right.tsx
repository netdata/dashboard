import React, { Fragment, useRef, useEffect } from "react"
import classNames from "classnames"

import { colorHex2Rgb } from "utils/color-hex-2-rgb"
import { useDateTime } from "utils/date-time"

import { legendResolutionTooltip, legendPluginModuleString } from "../utils/legend-utils"

import { ChartMetadata, DygraphData } from "../chart-types"

interface Props {
  chartData: DygraphData
  chartMetadata: ChartMetadata
  chartLibrary: string
  colors: {
    [key: string]: string
  }
  dimensionNames: string[]
  hoveredRow: number
  hoveredX: number | null
  legendFormatValue: (value: number | string | null) => (number | string)
  onDimensionClick: (clickedDimensionName: string, event: React.MouseEvent) => void
  selectedDimensions: string[]
  showLatestOnBlur: boolean
  unitsCurrent: string
  viewBefore: number
}

export const ChartLegendRight = ({
  chartData,
  chartMetadata,
  chartLibrary,
  colors,
  dimensionNames,
  hoveredRow,
  hoveredX,
  legendFormatValue,
  onDimensionClick,
  selectedDimensions,
  showLatestOnBlur,
  unitsCurrent,
  viewBefore,
}: Props) => {
  // todo handle also this case:
  // const netdataLast = chartData.last_entry * 1000
  // const dataUpdateEvery = chartData.view_update_every * 1000
  // showUndefined = Math.abs(netdataLast - viewBefore) > dataUpdateEvery
  // (showUndefined also when difference between last and before is bigger than granularity)
  const showUndefined = hoveredRow === -1 && !showLatestOnBlur

  // todo support timezone
  const legendDate = new Date(hoveredX || viewBefore)

  // todo make a possibility to add chartLegened when there's not chartData
  // (if this situation is possible)

  // @ts-ignore ignoring because options.current has inconsistent structure
  const colorFillOpacity = window.NETDATA.options.current[
    `color_fill_opacity_${chartMetadata.chart_type}`
  ]

  const { localeDateString, localeTimeString } = useDateTime()

  const scrollbarRef = useRef(null)
  useEffect(() => {
    if (scrollbarRef.current) {
      window.Ps.initialize(scrollbarRef.current, {
        wheelSpeed: 0.2,
        wheelPropagation: true,
        swipePropagation: true,
        minScrollbarLength: null,
        maxScrollbarLength: null,
        useBothWheelAxes: false,
        suppressScrollX: true,
        suppressScrollY: false,
        scrollXMarginOffset: 0,
        scrollYMarginOffset: 0,
        theme: "default",
      })
    }
  }, [scrollbarRef])

  return (
    <div className={classNames(
      "netdata-chart-legend",
      `netdata-${chartLibrary}-legend`,
    )}
    >
      <span
        className="netdata-legend-title-date"
        title={legendPluginModuleString(true, chartMetadata)}
      >
        {showUndefined
          ? legendPluginModuleString(false, chartMetadata)
          : localeDateString(legendDate)}
      </span>
      <br />
      <span
        className="netdata-legend-title-time"
        title={legendResolutionTooltip(chartData, chartMetadata)}
      >
        {showUndefined
          ? chartMetadata.context.toString()
          : localeTimeString(legendDate)}
      </span>
      <br />
      <span className="netdata-legend-title-units">{unitsCurrent}</span>
      <br />
      <div className="netdata-legend-series" ref={scrollbarRef}>
        <div className="netdata-legend-series-content">
          {dimensionNames.map((dimensionName, i) => {
            // todo dimension could be a separate component
            const color = colors[dimensionName]
            const rgb = colorHex2Rgb(color)

            const isSelected = selectedDimensions.length === 0
              || selectedDimensions.includes(dimensionName)

            let value
            if (showUndefined) {
              value = null
            } else if (hoveredRow !== -1) {
              const hoveredValueArray = chartData.result.data[hoveredRow]
              // [timestamp, valueDim1, valueDim2, ...]
              value = hoveredValueArray ? hoveredValueArray[i + 1] : null
            } else {
              value = chartData.view_latest_values[i]
            }

            return (
              <Fragment key={dimensionName}>
                {i !== 0 && <br />}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                <span
                  title={dimensionName}
                  className={classNames(
                    "netdata-legend-name",
                    isSelected ? "selected" : "not-selected",
                  )}
                  onClick={(event) => {
                    onDimensionClick(dimensionName, event)
                  }}
                  role="button"
                  style={{ color }}
                  tabIndex={0}
                >
                  <table
                    className={`netdata-legend-name-table-${chartMetadata.chart_type}`}
                    style={{
                      backgroundColor: `rgba(${rgb.r},${rgb.g},${rgb.b},${colorFillOpacity})`,
                    }}
                  >
                    <tbody>
                      <tr className="netdata-legend-name-tr">
                        <td className="netdata-legend-name-td" />
                      </tr>
                    </tbody>
                  </table>
                  {" "}
                  {dimensionName}
                </span>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                <span
                  title={dimensionName}
                  className={classNames(
                    "netdata-legend-value",
                    !isSelected && "hidden",
                  )}
                  onClick={(event) => {
                    onDimensionClick(dimensionName, event)
                  }}
                  role="button"
                  style={{ color }} // omitted !important during refractor, react doesn't support it
                  tabIndex={0}
                >
                  {legendFormatValue(
                    value,
                  )}
                </span>
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
