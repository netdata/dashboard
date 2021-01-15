import React, { useCallback } from "react"
import classNames from "classnames"

import { useDispatch, useSelector } from "store/redux-separate-context"
import { setGlobalChartUnderlayAction, setGlobalPanAndZoomAction } from "domains/global/actions"
import { selectSyncPanAndZoom } from "domains/global/selectors"
import { setChartPanAndZoomAction } from "domains/chart/actions"
import { useShowValueOutside } from "hooks/use-show-value-outside"

import { Attributes } from "../utils/transformDataAttributes"
import {
  ChartData, ChartMetadata, DygraphData, EasyPieChartData, D3pieChartData,
} from "../chart-types"
import { chartLibrariesSettings, ChartLibraryName } from "../utils/chartLibrariesSettings"

import { DygraphChart } from "./lib-charts/dygraph-chart"
import { EasyPieChart } from "./lib-charts/easy-pie-chart"
import { GaugeChart } from "./lib-charts/gauge-chart"
import { SparklineChart } from "./lib-charts/sparkline-chart"
import { D3pieChart } from "./lib-charts/d3pie-chart"
import { PeityChart } from "./lib-charts/peity-chart"
import { GoogleChart } from "./lib-charts/google-chart"
import { TextOnly } from "./lib-charts/text-only"
import { KubernetesGroupBoxes } from "./lib-charts/group-box-chart"

interface Props {
  attributes: Attributes
  chartContainerElement: HTMLElement
  chartData: ChartData
  chartMetadata: ChartMetadata
  chartLibrary: ChartLibraryName
  colors: {
    [key: string]: string
  }
  chartUuid: string
  chartHeight: number
  chartWidth: number
  dimensionsVisibility: boolean[]
  hasEmptyData: boolean
  isRemotelyControlled: boolean
  legendFormatValue: ((v: number | string | null) => number | string)
  orderedColors: string[]
  hoveredX: number | null
  onUpdateChartPanAndZoom: (arg: { after: number, before: number, masterID: string }) => void
  immediatelyDispatchPanAndZoom: () => void

  hoveredRow: number
  setHoveredX: (hoveredX: number | null, noMaster?: boolean) => void
  setMinMax: (minMax: [number, number]) => void
  showLatestOnBlur: boolean
  unitsCurrent: string
  viewAfterForCurrentData: number,
  viewBeforeForCurrentData: number,
}

export const AbstractChart = ({
  attributes,
  chartContainerElement,
  chartData,
  chartMetadata,
  chartLibrary,
  colors,
  chartUuid,
  chartHeight,
  chartWidth,
  dimensionsVisibility,
  hasEmptyData,
  isRemotelyControlled,
  legendFormatValue,
  orderedColors,
  hoveredRow,
  hoveredX,
  onUpdateChartPanAndZoom,
  immediatelyDispatchPanAndZoom,
  setHoveredX,
  setMinMax,
  showLatestOnBlur,
  unitsCurrent,
  viewAfterForCurrentData,
  viewBeforeForCurrentData,
}: Props) => {
  const dispatch = useDispatch()

  const isSyncPanAndZoom = useSelector(selectSyncPanAndZoom)
  const setGlobalChartUnderlay = useCallback(({ after, before, masterID }) => {
    dispatch(setGlobalChartUnderlayAction({ after, before, masterID }))

    // freeze charts
    // don't send masterID, so no padding is applied
    if (isSyncPanAndZoom) {
      dispatch(setGlobalPanAndZoomAction({
        after: viewAfterForCurrentData,
        before: viewBeforeForCurrentData,
      }))
    } else {
      dispatch(setChartPanAndZoomAction({
        after: viewAfterForCurrentData,
        before: viewBeforeForCurrentData,
        id: chartUuid,
      }))
    }
  }, [chartUuid, dispatch, isSyncPanAndZoom, viewAfterForCurrentData, viewBeforeForCurrentData])

  const chartSettings = chartLibrariesSettings[chartLibrary]
  const { hasLegend } = chartSettings
  const chartElementClassName = hasLegend(attributes)
    ? classNames(
      `netdata-chart-with-legend-${attributes.legendPosition || "right"}`,
      `netdata-${chartLibrary}-chart-with-legend-right`,
    )
    : classNames(
      "netdata-chart",
      `netdata-${chartLibrary}-chart`,
    )
  const chartElementId = `${chartLibrary}-${chartUuid}-chart`
  const showUndefined = hoveredRow === -1 && !showLatestOnBlur

  useShowValueOutside({
    attributes, chartData, chartSettings, hoveredRow, legendFormatValue, showUndefined,
  })

  if (chartLibrary === "easypiechart") {
    return (
      <EasyPieChart
        attributes={attributes}
        chartData={chartData as EasyPieChartData}
        chartMetadata={chartMetadata}
        chartElementClassName={chartElementClassName}
        chartElementId={chartElementId}
        chartLibrary={chartLibrary}
        chartWidth={chartWidth}
        colors={colors}
        chartUuid={chartUuid}
        dimensionsVisibility={dimensionsVisibility}
        isRemotelyControlled={isRemotelyControlled}
        // easyPieChart doesnt support resizing, so lets just create new one when
        // container size changes
        key={chartWidth}
        legendFormatValue={legendFormatValue}
        orderedColors={orderedColors}
        hoveredRow={hoveredRow}
        onUpdateChartPanAndZoom={onUpdateChartPanAndZoom}
        setGlobalChartUnderlay={setGlobalChartUnderlay}
        setMinMax={setMinMax}
        showUndefined={showUndefined}
        unitsCurrent={unitsCurrent}
        viewAfter={viewAfterForCurrentData}
        viewBefore={viewBeforeForCurrentData}
      />
    )
  }

  if (chartLibrary === "gauge") {
    return (
      <GaugeChart
        attributes={attributes}
        chartData={chartData as EasyPieChartData}
        chartMetadata={chartMetadata}
        chartElementClassName={chartElementClassName}
        chartElementId={chartElementId}
        chartLibrary={chartLibrary}
        chartHeight={chartHeight}
        chartWidth={chartWidth}
        colors={colors}
        chartUuid={chartUuid}
        dimensionsVisibility={dimensionsVisibility}
        isRemotelyControlled={isRemotelyControlled}
        legendFormatValue={legendFormatValue}
        orderedColors={orderedColors}
        hoveredRow={hoveredRow}
        hoveredX={hoveredX}
        onUpdateChartPanAndZoom={onUpdateChartPanAndZoom}
        setGlobalChartUnderlay={setGlobalChartUnderlay}
        setHoveredX={setHoveredX}
        setMinMax={setMinMax}
        showUndefined={showUndefined}
        unitsCurrent={unitsCurrent}
        viewAfter={viewAfterForCurrentData}
        viewBefore={viewBeforeForCurrentData}
      />
    )
  }

  if (chartLibrary === "sparkline") {
    return (
      <SparklineChart
        attributes={attributes}
        chartContainerElement={chartContainerElement}
        chartData={chartData as EasyPieChartData}
        chartMetadata={chartMetadata}
        chartElementClassName={chartElementClassName}
        chartElementId={chartElementId}
        dimensionsVisibility={dimensionsVisibility}
        isRemotelyControlled={isRemotelyControlled}
        orderedColors={orderedColors}
        unitsCurrent={unitsCurrent}
        viewAfterForCurrentData={viewAfterForCurrentData}
        viewBeforeForCurrentData={viewBeforeForCurrentData}
      />
    )
  }

  if (chartLibrary === "d3pie") {
    return (
      <D3pieChart
        attributes={attributes}
        chartContainerElement={chartContainerElement}
        chartData={chartData as D3pieChartData}
        chartMetadata={chartMetadata}
        chartElementClassName={chartElementClassName}
        chartElementId={chartElementId}
        dimensionsVisibility={dimensionsVisibility}
        hoveredRow={hoveredRow}
        hoveredX={hoveredX}
        isRemotelyControlled={isRemotelyControlled}
        legendFormatValue={legendFormatValue}
        orderedColors={orderedColors}
        setMinMax={setMinMax}
        showUndefined={showUndefined}
        unitsCurrent={unitsCurrent}
      />
    )
  }

  if (chartLibrary === "peity") {
    return (
      <PeityChart
        attributes={attributes}
        chartContainerElement={chartContainerElement}
        chartData={chartData as EasyPieChartData}
        chartMetadata={chartMetadata}
        chartElementClassName={chartElementClassName}
        chartElementId={chartElementId}
        orderedColors={orderedColors}
      />
    )
  }

  if (chartLibrary === "google") {
    return (
      <GoogleChart
        attributes={attributes}
        chartData={chartData as EasyPieChartData}
        chartMetadata={chartMetadata}
        chartElementClassName={chartElementClassName}
        chartElementId={chartElementId}
        orderedColors={orderedColors}
        unitsCurrent={unitsCurrent}
      />
    )
  }

  if (chartLibrary === "textonly") {
    return (
      <TextOnly
        attributes={attributes}
        chartData={chartData as EasyPieChartData}
        chartElementClassName={chartElementClassName}
        chartElementId={chartElementId}
      />
    )
  }

  if (chartLibrary === "groupbox") {
    return (
      <KubernetesGroupBoxes
        chartData={chartData}
        chartMetadata={chartMetadata}
        attributes={attributes}
        viewAfter={viewAfterForCurrentData}
        viewBefore={viewBeforeForCurrentData}
        hoveredRow={hoveredRow}
        hoveredX={hoveredX}
      />
    )
  }

  return (
    <DygraphChart
      attributes={attributes}
      chartData={chartData as DygraphData}
      chartMetadata={chartMetadata}
      chartElementClassName={chartElementClassName}
      chartElementId={chartElementId}
      chartLibrary={chartLibrary}
      colors={colors}
      chartUuid={chartUuid}
      dimensionsVisibility={dimensionsVisibility}
      hasEmptyData={hasEmptyData}
      hasLegend={hasLegend(attributes)}
      isRemotelyControlled={isRemotelyControlled}
      orderedColors={orderedColors}
      immediatelyDispatchPanAndZoom={immediatelyDispatchPanAndZoom}
      hoveredRow={hoveredRow}
      hoveredX={hoveredX}
      onUpdateChartPanAndZoom={onUpdateChartPanAndZoom}
      setGlobalChartUnderlay={setGlobalChartUnderlay}
      setHoveredX={setHoveredX}
      setMinMax={setMinMax}
      unitsCurrent={unitsCurrent}
      viewAfter={viewAfterForCurrentData}
      viewBefore={viewBeforeForCurrentData}
    />
  )
}
