import { sortBy, reverse } from "ramda"
import React, {
  useLayoutEffect, useRef, useCallback,
} from "react"
import classNames from "classnames"
import { useUpdateEffect, useUnmount, useMount } from "react-use"
// this version is needed because it contains a fix for handling constant value in the chart
// ie. https://github.com/danvk/dygraphs/pull/909
import Dygraph from "vendor/dygraph-c91c859.min"
import "dygraphs/src-es5/extras/smooth-plotter"
import ResizeObserver from "resize-observer-polyfill"

import { useDispatch, useSelector } from "store/redux-separate-context"
import { AppStateT } from "store/app-state"
import { DygraphArea, NetdataDygraph } from "types/vendor-overrides"
import { TimeRange } from "types/common"
import { useDateTime } from "utils/date-time"
import { debounce } from "utils/debounce"

import {
  selectCommonMin,
  selectCommonMax,
  selectGlobalChartUnderlay,
  selectGlobalSelectionMaster,
  selectSmoothPlot,
  selectSyncPanAndZoom,
  selectSpacePanelTransitionEndIsActive,
} from "domains/global/selectors"
import {
  resetGlobalPanAndZoomAction, setCommonMaxAction, setCommonMinAction,
} from "domains/global/actions"
import { resetChartPanAndZoomAction } from "domains/chart/actions"

import { Attributes } from "../../utils/transformDataAttributes"
import {
  chartLibrariesSettings,
  ChartLibraryConfig,
  ChartLibraryName,
} from "../../utils/chartLibrariesSettings"
import { ChartMetadata, DygraphData } from "../../chart-types"
import { selectResizeHeight } from "../../selectors"

import {
  getDygraphChartType, getDataForFakeStacked, transformColors, getDygraphFillAlpha,
  hackDygraphIFrameTarps,
} from "./dygraph/utils"
import "./dygraph-chart.css"

import useProceededChart from "../../hooks/use-proceeded-chart"
import ProceededChartDisclaimer from "./proceeded-chart-disclaimer"
import { useEmptyDataPlaceholder } from "./dygraph/empty-placeholder"

// This is the threshold above which we assume chart shown duration has changed
const timeframeThreshold = 5000
const dygraphResizeDebounceTime = 500

type IsInRangeOfAvailableData = (props: {
  after: number, before: number, chartData: DygraphData,
}) => boolean
const isInRangeOfAvailableData: IsInRangeOfAvailableData = ({ after, before, chartData }) => (
  after >= (chartData.first_entry * 1000) && before <= (chartData.last_entry * 1000)
)

interface GetInitialDygraphOptions {
  attributes: Attributes,
  chartData: DygraphData,
  chartMetadata: ChartMetadata,
  chartSettings: ChartLibraryConfig,
  dimensionsVisibility: boolean[]
  hasEmptyData: boolean
  hiddenLabelsElementId: string,
  isFakeStacked: boolean,
  orderedColors: string[],
  setMinMax: (minMax: TimeRange) => void
  shouldSmoothPlot: boolean,
  unitsCurrent: string,
  xAxisDateString: (d: Date) => string,
  xAxisTimeString: (d: Date) => string,
}
const getInitialDygraphOptions = ({
  attributes,
  chartData,
  chartMetadata,
  chartSettings,
  dimensionsVisibility,
  hasEmptyData,
  hiddenLabelsElementId,
  isFakeStacked,
  orderedColors,
  setMinMax,
  shouldSmoothPlot,
  unitsCurrent,
  xAxisDateString,
  xAxisTimeString,
}: GetInitialDygraphOptions) => {
  const isSparkline = attributes.dygraphTheme === "sparkline"
  const highlightCircleSize = isSparkline ? 3 : 4

  const isLogScale = (chartSettings.isLogScale as ((a: Attributes) => boolean))(attributes)
  const dygraphChartType = getDygraphChartType(attributes, chartData, chartMetadata, chartSettings)
  const {
    dygraphSmooth = dygraphChartType === "line"
      && !isSparkline,
    dygraphDrawAxis = true,
    legendPosition,
  } = attributes
  const isLegendOnBottom = legendPosition === "bottom"
  const {
    // destructuring with default values
    dygraphColors = orderedColors,
    dygraphRightGap = 5,
    dygraphShowRangeSelector = false,
    dygraphShowRoller = false,
    dygraphTitle = attributes.title || chartMetadata.title,
    dygraphTitleHeight = 19,
    dygraphLegend = "always",
    dygraphLabelsDiv = hiddenLabelsElementId,
    dygraphLabelsSeparateLine = true,
    dygraphIncludeZero = dygraphChartType === "stacked",
    dygraphShowZeroValues = true,
    dygraphShowLabelsOnHighLight = true,
    dygraphHideOverlayOnMouseOut = true,
    dygraphXRangePad = 0,
    dygraphYRangePad = 1,
    dygraphValueRange = [null, null],
    dygraphYLabelWidth = 12,
    // eslint-disable-next-line no-nested-ternary
    dygraphStrokeWidth = dygraphChartType === "stacked"
      ? 0.1
      : (dygraphSmooth === true
        ? 1.5
        : 0.7),

    dygraphStrokePattern,
    dygraphDrawPoints = false,
    dygraphDrawGapEdgePoints = true,
    dygraphConnectSeparatedPoints = false,
    dygraphPointSize = 1,
    dygraphStepPlot = false,
    dygraphStrokeBorderColor = window.NETDATA.themes.current.background,
    dygraphStrokeBorderWidth = 0,
    dygraphFillGraph = (dygraphChartType === "area" || dygraphChartType === "stacked"),
    dygraphFillAlpha = getDygraphFillAlpha(isFakeStacked, dygraphChartType),
    dygraphStackedGraph = dygraphChartType === "stacked" && !isFakeStacked,
    dygraphStackedGraphNanFill = "none",
    dygraphAxisLabelFontSize = 10,
    dygraphAxisLineColor = window.NETDATA.themes.current.axis,
    dygraphAxisLineWidth = 1.0,
    dygraphDrawGrid = true,
    dygraphGridLinePattern,
    dygraphGridLineWidth = 1.0,
    dygraphGridLineColor = window.NETDATA.themes.current.grid,
    dygraphMaxNumberWidth = 8,
    dygraphSigFigs,
    dygraphDigitsAfterDecimal = 2,
    dygraphHighlighCircleSize = highlightCircleSize,
    dygraphHighlightSeriesOpts,
    dygraphHighlightSeriesBackgroundAlpha,

    dygraphXPixelsPerLabel = 50,
    dygraphXAxisLabelWidth = 60,
    dygraphDrawXAxis = dygraphDrawAxis,
    dygraphYPixelsPerLabel = 15,
    dygraphYAxisLabelWidth = isLegendOnBottom ? 30 : 50,
    dygraphDrawYAxis = dygraphDrawAxis,
  } = attributes
  return {
    colors: isFakeStacked ? transformColors(reverse(dygraphColors)) : dygraphColors,

    // leave a few pixels empty on the right of the chart
    rightGap: isSparkline ? 0 : dygraphRightGap,
    showRangeSelector: dygraphShowRangeSelector,
    showRoller: dygraphShowRoller,
    title: isSparkline ? undefined : dygraphTitle,
    titleHeight: dygraphTitleHeight,
    legend: dygraphLegend, // we need this to get selection events
    labels: chartData.result.labels,
    labelsDiv: dygraphLabelsDiv,

    labelsSeparateLines: isSparkline ? true : dygraphLabelsSeparateLine,
    labelsShowZeroValues: isLogScale ? false : dygraphShowZeroValues,
    labelsKMB: false,
    labelsKMG2: false,
    showLabelsOnHighlight: dygraphShowLabelsOnHighLight,
    hideOverlayOnMouseOut: dygraphHideOverlayOnMouseOut,
    includeZero: dygraphIncludeZero,
    xRangePad: dygraphXRangePad,
    yRangePad: isSparkline ? 1 : dygraphYRangePad,
    valueRange: dygraphValueRange,
    ylabel: (isSparkline || isLegendOnBottom) ? undefined : unitsCurrent,
    yLabelWidth: (isSparkline || isLegendOnBottom) ? 0 : dygraphYLabelWidth,

    // the function to plot the chart
    plotter: (dygraphSmooth && shouldSmoothPlot) ? window.smoothPlotter : null,

    // The width of the lines connecting data points.
    // This can be used to increase the contrast or some graphs.
    strokeWidth: dygraphStrokeWidth,
    strokePattern: dygraphStrokePattern,

    // The size of the dot to draw on each point in pixels (see drawPoints).
    // A dot is always drawn when a point is "isolated",
    // i.e. there is a missing point on either side of it.
    // This also controls the size of those dots.
    drawPoints: dygraphDrawPoints,

    // Draw points at the edges of gaps in the data.
    // This improves visibility of small data segments or other data irregularities.
    drawGapEdgePoints: dygraphDrawGapEdgePoints,
    connectSeparatedPoints: isLogScale ? false : dygraphConnectSeparatedPoints,
    pointSize: dygraphPointSize,

    // enabling this makes the chart with little square lines
    stepPlot: dygraphStepPlot,

    // Draw a border around graph lines to make crossing lines more easily
    // distinguishable. Useful for graphs with many lines.
    strokeBorderColor: dygraphStrokeBorderColor,
    strokeBorderWidth: dygraphStrokeBorderWidth,
    fillGraph: dygraphFillGraph,
    fillAlpha: dygraphFillAlpha,
    stackedGraph: dygraphStackedGraph,
    stackedGraphNaNFill: dygraphStackedGraphNanFill,
    drawAxis: isSparkline ? false : dygraphDrawAxis,
    axisLabelFontSize: dygraphAxisLabelFontSize,
    axisLineColor: dygraphAxisLineColor,
    axisLineWidth: dygraphAxisLineWidth,
    drawGrid: isSparkline ? false : dygraphDrawGrid,
    gridLinePattern: dygraphGridLinePattern,
    gridLineWidth: dygraphGridLineWidth,
    gridLineColor: dygraphGridLineColor,
    maxNumberWidth: dygraphMaxNumberWidth,
    sigFigs: dygraphSigFigs,
    digitsAfterDecimal: dygraphDigitsAfterDecimal,
    highlightCircleSize: dygraphHighlighCircleSize,
    highlightSeriesOpts: dygraphHighlightSeriesOpts, // TOO SLOW: { strokeWidth: 1.5 },
    // TOO SLOW: (state.tmp.dygraph_chart_type === 'stacked')?0.7:0.5,
    highlightSeriesBackgroundAlpha: dygraphHighlightSeriesBackgroundAlpha,
    visibility: dimensionsVisibility,
    logscale: isLogScale,

    axes: {
      x: {
        pixelsPerLabel: dygraphXPixelsPerLabel,
        // unsufficient typings for Dygraph
        // @ts-ignore
        ticker: Dygraph.dateTicker,
        axisLabelWidth: dygraphXAxisLabelWidth,
        drawAxis: isSparkline ? false : dygraphDrawXAxis,
        axisLabelFormatter: (d: Date | number) => ((d as Date).toTimeString().startsWith("00:00:00")
          ? xAxisDateString(d as Date)
          : xAxisTimeString(d as Date)
        ),
      },
      y: {
        logscale: isLogScale,
        pixelsPerLabel: dygraphYPixelsPerLabel,
        axisLabelWidth: dygraphYAxisLabelWidth,
        drawAxis: isSparkline ? false : dygraphDrawYAxis,
        // axisLabelFormatter is added on the updates
        axisLabelFormatter(y: Date | number) {
          if (hasEmptyData) {
            return ""
          }
          const formatter = setMinMax([
            // @ts-ignore
            // eslint-disable-next-line no-underscore-dangle
            this.axes_[0].extremeRange[0],
            // @ts-ignore
            // eslint-disable-next-line no-underscore-dangle
            this.axes_[0].extremeRange[1],
          ]) as unknown as ((value: Date | number) => string)
          return formatter(y as number)
        },
      },
    },
  }
}

interface Props {
  attributes: Attributes
  chartData: DygraphData
  chartMetadata: ChartMetadata
  chartElementClassName: string
  chartElementId: string
  chartLibrary: ChartLibraryName
  chartUuid: string
  dimensionsVisibility: boolean[]
  hasEmptyData: boolean
  hasLegend: boolean
  isRemotelyControlled: boolean
  onUpdateChartPanAndZoom: (arg: {
    after: number, before: number,
    callback: (after: number, before: number) => void,
    masterID: string,
    shouldNotExceedAvailableRange: boolean,
  }) => void
  orderedColors: string[]
  immediatelyDispatchPanAndZoom: () => void

  hoveredRow: number
  hoveredX: number | null
  setGlobalChartUnderlay: (arg: { after: number, before: number, masterID: string }) => void
  setHoveredX: (hoveredX: number | null, noMaster?: boolean) => void
  setMinMax: (minMax: TimeRange) => void
  unitsCurrent: string
  viewAfter: number
  viewBefore: number
}
export const DygraphChart = ({
  chartMetadata,
  chartElementClassName,
  chartElementId,
  chartLibrary,
  chartUuid,
  dimensionsVisibility,
  hasEmptyData,
  hasLegend,
  isRemotelyControlled,
  onUpdateChartPanAndZoom,
  immediatelyDispatchPanAndZoom,

  hoveredRow,
  hoveredX,
  setGlobalChartUnderlay,
  setHoveredX,
  setMinMax,
  unitsCurrent,
  ...rest
}: Props) => {
  const {
    attributes, chartData, orderedColors, viewAfter, viewBefore,
  } = useEmptyDataPlaceholder({
    ...rest,
    hasEmptyData,
  })

  const globalChartUnderlay = useSelector(selectGlobalChartUnderlay)

  const { xAxisDateString, xAxisTimeString } = useDateTime()
  const chartSettings = chartLibrariesSettings[chartLibrary]
  const hiddenLabelsElementId = `${chartUuid}-hidden-labels-id`

  const dygraphChartType = getDygraphChartType(attributes, chartData, chartMetadata, chartSettings)
  // isFakeStacked - is a special mode for displaying stacked charts with both positive and negative
  // values. Dygraph.js doesn't support it so in this case we need to sum the values manually
  // and display the chart as "area" type, but with keeping all styling (fill etc.) properties
  // as in "stacked" type
  // because first values need to be "on top" (at least for positive values), the dimension order
  // needs to be reversed (in getDataForFakeStacked function and when assigning dimension colors)
  const isFakeStacked = chartData.min < 0 && dygraphChartType === "stacked"
  const dygraphFillAlpha = getDygraphFillAlpha(isFakeStacked, dygraphChartType)

  const chartElement = useRef<HTMLDivElement>(null)

  const updateChartPanOrZoom = useCallback(({
    after, before,
    callback,
    shouldNotExceedAvailableRange,
  }) => {
    onUpdateChartPanAndZoom({
      after,
      before,
      callback,
      masterID: chartUuid,
      shouldNotExceedAvailableRange,
    })
  }, [chartUuid, onUpdateChartPanAndZoom])

  // keep in ref to prevent additional updates
  const dygraphInstance = useRef<Dygraph | null>()
  // state.tmp.dygraph_user_action in old dashboard
  const latestIsUserAction = useRef(false)
  // state.tmp.dygraph_mouse_down in old dashboard
  const isMouseDown = useRef(false)
  // state.tmp.dygraph_highlight_after in old dashboard
  const dygraphHighlightAfter = useRef<null | number>(null)
  // state.dygraph_last_touch_move in old dashboard
  const dygraphLastTouchMove = useRef(0)
  // state.dygraph_last_touch_page_x in old dashboard
  const dygraphLastTouchPageX = useRef(0)
  // state.dygraph_last_touch_end in old dashboard
  const dygraphLastTouchEnd = useRef<undefined | number>()

  const [
    isProceeded, precededChartRef, updatePrecededPosition,
  ] = useProceededChart(chartData.first_entry)

  const dispatch = useDispatch()
  const isSyncPanAndZoom = useSelector(selectSyncPanAndZoom)

  const resetGlobalPanAndZoom = useCallback(() => {
    latestIsUserAction.current = false // prevent starting panAndZoom
    if (dygraphInstance.current) {
      // todo on toolbox reset click, do updateOptions({ dateWindow: null })
      // (issue existed also before rewrite)
      dygraphInstance.current.updateOptions({
        // reset dateWindow to the current
        // @ts-ignore external typings dont support null
        dateWindow: null,
      })
    }

    if (isSyncPanAndZoom) {
      dispatch(resetGlobalPanAndZoomAction())
    } else {
      dispatch(resetChartPanAndZoomAction({ id: chartUuid }))
    }
  }, [chartUuid, dispatch, isSyncPanAndZoom])

  // setGlobalChartUnderlay is using state from closure (chartData.after), so we need to have always
  // the newest callback. Unfortunately we cannot use Dygraph.updateOptions() (library restriction)
  // for interactionModel callbacks so we need to keep the callback in mutable ref
  const propsRef = useRef({
    chartData,
    globalChartUnderlay,
    hoveredX,
    immediatelyDispatchPanAndZoom,
    // put it to ref to prevent additional updateOptions() after creating dygraph
    resetGlobalPanAndZoom,
    setGlobalChartUnderlay,
    updateChartPanOrZoom,
    updatePrecededPosition,
    viewAfter,
    viewBefore,
  })
  useLayoutEffect(() => {
    propsRef.current.chartData = chartData
    propsRef.current.hoveredX = hoveredX
    propsRef.current.immediatelyDispatchPanAndZoom = immediatelyDispatchPanAndZoom
    propsRef.current.globalChartUnderlay = globalChartUnderlay
    propsRef.current.resetGlobalPanAndZoom = resetGlobalPanAndZoom
    propsRef.current.setGlobalChartUnderlay = setGlobalChartUnderlay
    propsRef.current.updateChartPanOrZoom = updateChartPanOrZoom
    propsRef.current.updatePrecededPosition = updatePrecededPosition
    propsRef.current.viewAfter = viewAfter
    propsRef.current.viewBefore = viewBefore
  }, [chartData, globalChartUnderlay, hoveredX, immediatelyDispatchPanAndZoom,
    resetGlobalPanAndZoom, setGlobalChartUnderlay, updateChartPanOrZoom, updatePrecededPosition,
    viewAfter, viewBefore])

  const shouldSmoothPlot = useSelector(selectSmoothPlot)
  useLayoutEffect(() => {
    if (chartElement?.current && !dygraphInstance.current && chartData.result.data.length) {
      const dygraphOptionsStatic = getInitialDygraphOptions({
        attributes,
        chartData,
        chartMetadata,
        chartSettings,
        dimensionsVisibility,
        hasEmptyData,
        hiddenLabelsElementId,
        isFakeStacked,
        orderedColors,
        setMinMax,
        shouldSmoothPlot,
        unitsCurrent,
        xAxisDateString,
        xAxisTimeString,
      })

      latestIsUserAction.current = false

      const dygraphOptions = {
        ...dygraphOptionsStatic,
        // set dateWindow on init - this is needed when chart is globalPanAndZoom-master
        // and user scrolls down/up so the chart hides and then unhides. This causes the chart
        // to re-create, but the data has additional padding which should be outside of
        // visible range
        dateWindow: [propsRef.current.viewAfter, propsRef.current.viewBefore],

        highlightCallback(
          event: MouseEvent, xval: number,
        ) {
          // todo
          // state.pauseChart()

          const newHoveredX = isMouseDown.current
            ? null
            : xval

          const currentHoveredX = propsRef.current.hoveredX
          if (newHoveredX !== currentHoveredX) {
            setHoveredX(newHoveredX)
          }
        },

        unhighlightCallback() {
          // todo
          // state.unpauseChart();
          if (propsRef.current.hoveredX !== null) {
            setHoveredX(null)
          }
        },
        drawCallback(dygraph: Dygraph) {
          // the user has panned the chart and this is called to re-draw the chart
          // 1. refresh this chart by adding data to it
          // 2. notify all the other charts about the update they need

          // to prevent an infinite loop (feedback), we use
          //     state.tmp.dygraph_user_action
          // - when true, this is initiated by a user
          // - when false, this is feedback

          if (latestIsUserAction.current) {
            latestIsUserAction.current = false
            const xRange = dygraph.xAxisRange()
            const after = Math.round(xRange[0])
            const before = Math.round(xRange[1])

            if (isInRangeOfAvailableData({
              after, before, chartData: propsRef.current.chartData,
            })) {
              propsRef.current.updateChartPanOrZoom({ after, before })
            }
          }
        },
        zoomCallback: (minDate: number, maxDate: number) => {
          latestIsUserAction.current = true
          propsRef.current.updateChartPanOrZoom({ after: minDate, before: maxDate })
        },

        underlayCallback(canvas: CanvasRenderingContext2D, area: DygraphArea, g: Dygraph) {
          propsRef.current.updatePrecededPosition(g)

          // the chart is about to be drawn
          // this function renders global highlighted time-frame

          if (propsRef.current.globalChartUnderlay) {
            const { after, before } = propsRef.current.globalChartUnderlay

            if (after < before) {
              const HIGHLIGHT_HORIZONTAL_PADDING = 20
              const bottomLeft = g.toDomCoords(after, -HIGHLIGHT_HORIZONTAL_PADDING)
              const topRight = g.toDomCoords(before, HIGHLIGHT_HORIZONTAL_PADDING)

              const left = bottomLeft[0]
              const right = topRight[0]

              // eslint-disable-next-line no-param-reassign
              canvas.fillStyle = window.NETDATA.themes.current.highlight
              canvas.fillRect(left, area.y, right - left, area.h)
            }
          }
        },

        // interactionModel cannot be replaced with updateOptions(). we need to keep all changing
        // values and callbacks in mutable ref,
        interactionModel: {
          mousedown(event: MouseEvent, dygraph: Dygraph, context: any) {
            // Right-click should not initiate anything.
            if (event.button && event.button === 2) {
              return
            }

            latestIsUserAction.current = true
            isMouseDown.current = true
            context.initializeMouseDown(event, dygraph, context)

            // limit problematic dygraph's feature, more info above the function
            // eslint-disable-next-line no-param-reassign
            context.tarp.tarps = hackDygraphIFrameTarps(context.tarp.tarps)

            if (event.button && event.button === 1) {
              // middle mouse button

              if (event.shiftKey) {
                // panning
                dygraphHighlightAfter.current = null
                // @ts-ignore
                Dygraph.startPan(event, dygraph, context)
              } else if (event.altKey || event.ctrlKey || event.metaKey) {
                // middle mouse button highlight
                dygraphHighlightAfter.current = dygraph.toDataXCoord(event.offsetX)
                // @ts-ignore
                Dygraph.startZoom(event, dygraph, context)
              } else {
                // middle mouse button selection for zoom
                dygraphHighlightAfter.current = null
                // @ts-ignore
                Dygraph.startZoom(event, dygraph, context)
              }
            } else if (event.shiftKey) {
              // left mouse button selection for zoom (ZOOM)
              dygraphHighlightAfter.current = null
              // @ts-ignore
              Dygraph.startZoom(event, dygraph, context)
            } else if (event.altKey || event.ctrlKey || event.metaKey) {
              // left mouse button highlight
              dygraphHighlightAfter.current = dygraph.toDataXCoord(event.offsetX)
              // @ts-ignore
              Dygraph.startZoom(event, dygraph, context)
            } else {
              // left mouse button dragging (PAN)
              dygraphHighlightAfter.current = null
              // @ts-ignore
              Dygraph.startPan(event, dygraph, context)
            }
          },

          mousemove(event: MouseEvent, dygraph: Dygraph, context: any) {
            // if (state.tmp.dygraph_highlight_after !== null) {
            // else if (
            if (dygraphHighlightAfter.current !== null) {
              // highlight selection
              latestIsUserAction.current = true
              // @ts-ignore
              Dygraph.moveZoom(event, dygraph, context)
              event.preventDefault()
            } else if (context.isPanning) {
              latestIsUserAction.current = true
              // eslint-disable-next-line no-param-reassign
              context.is2DPan = false
              // @ts-ignore
              Dygraph.movePan(event, dygraph, context)
            } else if (context.isZooming) {
              // @ts-ignore
              Dygraph.moveZoom(event, dygraph, context)
            }
          },

          mouseup(event: MouseEvent, dygraph: Dygraph, context: any) {
            isMouseDown.current = false
            if (dygraphHighlightAfter.current !== null) {
              const sortedRange = sortBy((x) => +x, [
                dygraphHighlightAfter.current,
                dygraph.toDataXCoord(event.offsetX),
              ])

              propsRef.current.setGlobalChartUnderlay({
                after: sortedRange[0],
                before: sortedRange[1],
                masterID: chartUuid,
              })
              dygraphHighlightAfter.current = null
              // eslint-disable-next-line no-param-reassign
              context.isZooming = false

              // old dashboard code
              // @ts-ignore
              // eslint-disable-next-line no-underscore-dangle
              dygraph.clearZoomRect_()
              // this call probably fixes the broken selection circle during highlighting
              // and forces underlayCallback to fire (and draw highlight-rect
              // @ts-ignore
              // eslint-disable-next-line no-underscore-dangle
              dygraph.drawGraph_(false)
            } else if (context.isPanning) {
              latestIsUserAction.current = true
              // @ts-ignore
              Dygraph.endPan(event, dygraph, context)
              propsRef.current.immediatelyDispatchPanAndZoom()
            } else if (context.isZooming) {
              latestIsUserAction.current = true
              // @ts-ignore
              Dygraph.endZoom(event, dygraph, context)
              propsRef.current.immediatelyDispatchPanAndZoom()
            }
          },

          wheel(event: WheelEvent, dygraph: Dygraph) {
            // Take the offset of a mouse event on the dygraph canvas and
            // convert it to a pair of percentages from the bottom left.
            // (Not top left, bottom is where the lower value is.)
            function offsetToPercentage(g: Dygraph, offsetX: number, offsetY: number) {
              // This is calculating the pixel offset of the leftmost date.
              const xOffset = g.toDomXCoord(g.xAxisRange()[0])
              const yar0 = g.yAxisRange(0)

              // This is calculating the pixel of the highest value. (Top pixel)
              const yOffset = g.toDomYCoord(yar0[1])

              // x y w and h are relative to the corner of the drawing area,
              // so that the upper corner of the drawing area is (0, 0).
              const x = offsetX - xOffset
              const y = offsetY - yOffset

              // This is computing the rightmost pixel, effectively defining the
              // width.
              // const w = g.toDomCoords(g.xAxisRange()[1], null)[0] - xOffset
              const w = g.toDomXCoord(g.xAxisRange()[1]) - xOffset

              // This is computing the lowest pixel, effectively defining the height.
              // const h = g.toDomCoords(null, yar0[0])[1] - yOffset
              const h = g.toDomYCoord(yar0[0]) - yOffset

              // Percentage from the left.
              const xPct = w === 0 ? 0 : (x / w)
              // Percentage from the top.
              const yPct = h === 0 ? 0 : (y / h)

              // The (1-) part below changes it from "% distance down from the top"
              // to "% distance up from the bottom".
              return [xPct, (1 - yPct)]
            }

            function adjustAxis(axis: [number, number], zoomInPercentage: number, bias: number) {
              const delta = axis[1] - axis[0]
              const increment = delta * zoomInPercentage
              const foo = [increment * bias, increment * (1 - bias)]

              return [axis[0] + foo[0], axis[1] - foo[1]]
            }

            // Adjusts [x, y] toward each other by zoomInPercentage%
            // Split it so the left/bottom axis gets xBias/yBias of that change and
            // tight/top gets (1-xBias)/(1-yBias) of that change.
            //
            // If a bias is missing it splits it down the middle.
            function zoomRange(g: Dygraph, zoomInPercentage: number, xBias: number, yBias: number) {
              const yAxes = g.yAxisRanges()
              const newYAxes = []
              for (let i = 0; i < yAxes.length; i += 1) {
                newYAxes[i] = adjustAxis(yAxes[i], zoomInPercentage, (yBias || 0.5))
              }

              return adjustAxis(g.xAxisRange(), zoomInPercentage, (xBias || 0.5))
            }

            if (event.altKey || event.shiftKey) {
              latestIsUserAction.current = true

              // http://dygraphs.com/gallery/interaction-api.js
              let normalDef
              // @ts-ignore
              if (typeof event.wheelDelta === "number" && !Number.isNaN(event.wheelDelta)) {
                // chrome
                // @ts-ignore
                normalDef = event.wheelDelta / 40
              } else {
                // firefox
                normalDef = event.deltaY * -1.2
              }

              const normal = (event.detail) ? event.detail * -1 : normalDef
              const percentage = normal / 50

              const percentages = offsetToPercentage(dygraph, event.offsetX, event.offsetY)
              const xPct = percentages[0]
              const yPct = percentages[1]

              const [after, before] = zoomRange(dygraph, percentage, xPct, yPct)

              propsRef.current.updateChartPanOrZoom({
                after,
                before,
                shouldNotExceedAvailableRange: true,
                callback: (updatedAfter: number, updatedBefore: number) => {
                  dygraph.updateOptions({
                    dateWindow: [updatedAfter, updatedBefore],
                  })
                },
              })

              event.preventDefault()
            }
          },

          click(event: MouseEvent) {
            event.preventDefault()
          },

          dblclick() {
            propsRef.current.resetGlobalPanAndZoom()
          },

          touchstart(event: TouchEvent, dygraph: Dygraph, context: any) {
            isMouseDown.current = true
            latestIsUserAction.current = true

            // todo
            // state.pauseChart()

            Dygraph.defaultInteractionModel.touchstart(event, dygraph, context)

            // we overwrite the touch directions at the end, to overwrite
            // the internal default of dygraph
            // eslint-disable-next-line no-param-reassign
            context.touchDirections = { x: true, y: false }

            dygraphLastTouchMove.current = 0

            if (typeof event.touches[0].pageX === "number") {
              dygraphLastTouchPageX.current = event.touches[0].pageX
            } else {
              dygraphLastTouchPageX.current = 0
            }
          },
          touchmove(event: TouchEvent, dygraph: Dygraph, context: any) {
            latestIsUserAction.current = true
            Dygraph.defaultInteractionModel.touchmove(event, dygraph, context)

            dygraphLastTouchMove.current = Date.now()
          },

          touchend(event: TouchEvent, dygraph: Dygraph, context: any) {
            isMouseDown.current = false
            latestIsUserAction.current = true
            Dygraph.defaultInteractionModel.touchend(event, dygraph, context)

            // if it didn't move, it is a selection
            if (dygraphLastTouchMove.current === 0 && dygraphLastTouchPageX.current !== 0
              && chartElement.current // this is just for TS
            ) {
              latestIsUserAction.current = false // prevent updating pan-and-zoom
              // internal api of dygraph
              // @ts-ignore
              // eslint-disable-next-line no-underscore-dangle
              const dygraphPlotter = dygraph.plotter_
              const pct = (dygraphLastTouchPageX.current - (
                dygraphPlotter.area.x + chartElement.current.getBoundingClientRect().left
              )) / dygraphPlotter.area.w

              const { current } = propsRef
              const t = Math.round(current.viewAfter
                + (current.viewBefore - current.viewAfter) * pct)
              // dont set "master" so the highlight is recalculated (to match existing row)
              setHoveredX(t, true)
            }

            // if it was double tap within double click time, reset the charts
            const now = Date.now()
            if (typeof dygraphLastTouchEnd.current !== "undefined") {
              if (dygraphLastTouchMove.current === 0) {
                const dt = now - dygraphLastTouchEnd.current
                if (dt <= window.NETDATA.options.current.double_click_speed) {
                  propsRef.current.resetGlobalPanAndZoom()
                }
              }
            }

            // remember the timestamp of the last touch end
            dygraphLastTouchEnd.current = now
            propsRef.current.immediatelyDispatchPanAndZoom()
          },
        },
      }

      const data = isFakeStacked
        ? getDataForFakeStacked(chartData.result.data, dimensionsVisibility)
        : chartData.result.data
      const instance = new Dygraph((chartElement.current), data, dygraphOptions)
      dygraphInstance.current = instance
    }
  }, [attributes, chartData, chartMetadata, chartSettings, chartUuid, dimensionsVisibility,
    hasEmptyData, hiddenLabelsElementId, isFakeStacked,
    orderedColors, setHoveredX, setMinMax, shouldSmoothPlot, unitsCurrent,
    xAxisDateString, xAxisTimeString])

  useUpdateEffect(() => {
    if (dygraphInstance.current) {
      const isSparkline = attributes.dygraphTheme === "sparkline"
      const isLegendOnBottom = attributes.legendPosition === "bottom"
      dygraphInstance.current.updateOptions({
        ylabel: (isSparkline || isLegendOnBottom) ? undefined : unitsCurrent,
      })
    }
  }, [attributes, unitsCurrent])


  // immediately update when changing global chart underlay
  useUpdateEffect(() => {
    if (dygraphInstance.current) {
      dygraphInstance.current.updateOptions({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalChartUnderlay])

  const spacePanelTransitionEndIsActive = useSelector(selectSpacePanelTransitionEndIsActive)
  useUpdateEffect(() => {
    if (dygraphInstance.current) {
      // dygraph always resizes on browser width change, but doesn't resize when the container
      // has different width.
      window.requestAnimationFrame(() => {
        if (dygraphInstance.current) {
          (dygraphInstance.current as NetdataDygraph).resize()
        }
      })
    }
  }, [spacePanelTransitionEndIsActive])

  // update data of the chart
  // first effect should only be made by new DygraphInstance()
  useUpdateEffect(() => {
    // dont update when there is no data - in this case we should still show old chart
    if (dygraphInstance.current && !hasEmptyData) {
      // todo support state.tmp.dygraph_force_zoom
      const forceDateWindow = [viewAfter, viewBefore]

      // in old dashboard, when chart needed to reset internal dateWindow state,
      // dateWindow was set to null, and new dygraph got the new dateWindow from results.
      // this caused small unsync between dateWindow of parent (master) and child charts
      // i also detected that forceDateWindow timestamps have slightly better performance (10%)
      // so if the chart needs to change local dateWindow, we'll always use timestamps instead of
      // null.

      const xAxisRange = dygraphInstance.current.xAxisRange()
      // eslint-disable-next-line max-len
      const hasChangedDuration = Math.abs((viewBefore - viewAfter) - (xAxisRange[1] - xAxisRange[0])) > timeframeThreshold

      // check if the time is relative
      const hasScrolledToTheFutureDuringPlayMode = viewBefore <= 0
      && (xAxisRange[1] > viewBefore)
      // if viewAfter is bigger than current dateWindow start, just reset dateWindow
      && (xAxisRange[0] > viewAfter)
      && !hasChangedDuration

      const optionsDateWindow = (isRemotelyControlled && !hasScrolledToTheFutureDuringPlayMode)
        ? { dateWindow: forceDateWindow }
        : {}

      const { dygraphColors = orderedColors } = attributes
      const file = isFakeStacked
        ? getDataForFakeStacked(chartData.result.data, dimensionsVisibility)
        : chartData.result.data

      dygraphInstance.current.updateOptions({
        ...optionsDateWindow,
        colors: isFakeStacked ? transformColors(reverse(dygraphColors)) : dygraphColors,
        file,
        labels: chartData.result.labels,
        fillAlpha: dygraphFillAlpha,
        stackedGraph: dygraphChartType === "stacked" && !isFakeStacked,
        // see explanation about reversing before isFakeStacked assignment
        visibility: isFakeStacked ? reverse(dimensionsVisibility) : dimensionsVisibility,
      })
    }
  }, [attributes, chartData.result, chartUuid, dimensionsVisibility, dygraphChartType,
    dygraphFillAlpha, hasEmptyData, isFakeStacked, isRemotelyControlled, orderedColors,
    viewAfter, viewBefore])

  useUpdateEffect(() => {
    if (!dygraphInstance.current) {
      return
    }

    const dygraphOptionsStatic = getInitialDygraphOptions({
      attributes,
      chartData,
      chartMetadata,
      chartSettings,
      dimensionsVisibility,
      hasEmptyData,
      hiddenLabelsElementId,
      isFakeStacked,
      orderedColors,
      setMinMax,
      shouldSmoothPlot,
      unitsCurrent,
      xAxisDateString,
      xAxisTimeString,
    })
    dygraphInstance.current.updateOptions(dygraphOptionsStatic)
  }, [dygraphChartType])

  // set selection
  const currentSelectionMasterId = useSelector(selectGlobalSelectionMaster)
  useLayoutEffect(() => {
    if (dygraphInstance.current && currentSelectionMasterId !== chartUuid) {
      if (hoveredRow === -1) {
        // getSelection is 100 times faster that clearSelection
        if (dygraphInstance.current.getSelection() !== -1) {
          dygraphInstance.current.clearSelection()
        }
        return
      }
      dygraphInstance.current.setSelection(hoveredRow)
    }
  }, [chartData, chartUuid, currentSelectionMasterId, hoveredRow,
    viewAfter, viewBefore])


  // handle resizeHeight change
  const resizeHeight = useSelector(
    (state: AppStateT) => selectResizeHeight(state, { id: chartUuid }),
  )
  useLayoutEffect(() => {
    if (dygraphInstance.current) {
      (dygraphInstance.current as NetdataDygraph).resize()
    }
  }, [resizeHeight, chartData.dimension_names.length])


  const commonMinState = useSelector((state: AppStateT) => (
    attributes.commonMin
      ? selectCommonMin(state, attributes.commonMin)
      : undefined
  ))
  const commonMaxState = useSelector((state: AppStateT) => (
    attributes.commonMax
      ? selectCommonMax(state, attributes.commonMax)
      : undefined
  ))

  useLayoutEffect(() => {
    const { commonMin: commonMinKey, commonMax: commonMaxKey } = attributes

    if (
      dygraphInstance.current
      && (commonMinKey || commonMaxKey)
    ) {
      const extremes = (dygraphInstance.current as NetdataDygraph).yAxisExtremes()[0]
      const [currentMin, currentMax] = extremes

      const {
        dygraphValueRange = [null, null],
      } = attributes
      // if the user gave a valueRange, respect it
      const shouldUseCommonMin = dygraphValueRange[0] === null
      const shouldUseCommonMax = dygraphValueRange[1] === null


      let shouldUpdate = false
      let valueRange: number[] = [...extremes]

      // check if current extreme (painted by dygraph) is not more extreme than commonMin/Max
      // if yes - update the chart
      if (commonMinKey && shouldUseCommonMin) {
        if (commonMinState && commonMinState.currentExtreme < currentMin) {
          valueRange[0] = commonMinState.currentExtreme
          shouldUpdate = true
        }
      }
      if (commonMaxKey && shouldUseCommonMax) {
        if (commonMaxState && commonMaxState.currentExtreme > currentMax) {
          valueRange[1] = commonMaxState.currentExtreme
          shouldUpdate = true
        }
      }

      if (shouldUpdate) {
        dygraphInstance.current.updateOptions({ valueRange })
        const newExtremes = (dygraphInstance.current as NetdataDygraph).yAxisExtremes()[0]
        // get updated valueRange (rounded by dygraph)
        valueRange = [...newExtremes]
      }

      // if the value is different than the one stored in state, update redux state
      if (commonMinKey && shouldUseCommonMin
        && (valueRange[0] !== commonMinState?.charts[chartUuid])
      ) {
        dispatch(setCommonMinAction({ chartUuid, commonMinKey, value: valueRange[0] }))
      }
      if (commonMaxKey && shouldUseCommonMax
        && (valueRange[1] !== commonMaxState?.charts[chartUuid])
      ) {
        dispatch(setCommonMaxAction({ chartUuid, commonMaxKey, value: valueRange[1] }))
      }
    }
  }, [attributes, chartData.result, chartUuid, commonMinState, commonMaxState, dispatch])

  useLayoutEffect(() => {
    if (isProceeded && dygraphInstance.current) {
      updatePrecededPosition(dygraphInstance.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProceeded])

  useUnmount(() => {
    if (dygraphInstance.current) {
      dygraphInstance.current.destroy()
    }
  })

  /**
   * resize with ResizeObserver
   */
  const resizeObserver = useRef<ResizeObserver>()
  useMount(() => {
    if (!attributes.detectResize) {
      return
    }
    // flag used to prevent first callback (and resize) on dygraph initial draw
    let hasOmitedFirstCallback = false
    const callbackDebounced = debounce(() => {
      if (!hasOmitedFirstCallback) {
        hasOmitedFirstCallback = true
        return
      }

      if (dygraphInstance.current) {
        (dygraphInstance.current as NetdataDygraph).resize()
      }
    }, dygraphResizeDebounceTime)

    resizeObserver.current = new ResizeObserver(() => {
      callbackDebounced()
    })
    resizeObserver.current.observe(chartElement.current as HTMLDivElement)
  })

  useUnmount(() => {
    dygraphInstance.current = null // clear it for debounce purposes
    if (resizeObserver.current) {
      resizeObserver.current.disconnect()
    }
  })

  const isLegendOnBottom = attributes.legendPosition === "bottom"

  return (
    <>
      <div
        ref={chartElement}
        id={chartElementId}
        className={classNames(
          chartElementClassName,
          { "dygraph-chart--legend-bottom": isLegendOnBottom },
        )}
      />
      {isProceeded && hasLegend && (
        <ProceededChartDisclaimer ref={precededChartRef as React.Ref<HTMLDivElement>} />
      )}
      <div className="dygraph-chart__labels-hidden" id={hiddenLabelsElementId} />
    </>
  )
}
