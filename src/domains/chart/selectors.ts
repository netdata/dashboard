import { prop } from "ramda"
import { createSelector } from "reselect"

import { AppStateT } from "store/app-state"
import { selectChartMetadataFromChartsCall } from "domains/global/selectors"

import { ChartState } from "./chart-types"
import { initialSingleState } from "./reducer"
import { storeKey } from "./constants"

export const selectChartsState = (state: AppStateT) => state[storeKey]
export const selectSingleChartState = createSelector(
  selectChartsState,
  (_: unknown, { id }: { chartId?: string, id: string }) => id,
  (chartsState, id) => chartsState[id] || initialSingleState,
)

export const selectChartData = createSelector(
  selectSingleChartState,
  (chartState) => chartState.chartData,
)

const selectChartMetadataFromExplicitCall = createSelector(
  selectSingleChartState, prop("chartMetadata"),
)
// dashboard.js normally fetches metadata for every individual charts, but we can prevent it
// if metadata for ALL charts will be present in state.global (from single call)
const selectChartMetadata = createSelector(
  selectChartMetadataFromChartsCall,
  selectChartMetadataFromExplicitCall,
  (metadataFromAll, metadataFromSingleCall) => metadataFromAll || metadataFromSingleCall,
)
const selectIsFetchingDetails = createSelector(selectSingleChartState, prop("isFetchingDetails"))

export const makeSelectChartMetadataRequest = () => createSelector(
  selectChartMetadata,
  selectIsFetchingDetails,
  (chartMetadata, isFetchingDetails) => ({ chartMetadata, isFetchingDetails }),
)

export const selectChartViewRange = createSelector(
  selectSingleChartState,
  (chartState) => chartState.fetchDataParams.viewRange,
)

export const selectChartFetchDataParams = createSelector(
  selectSingleChartState,
  (chartState) => chartState.fetchDataParams,
)

export const selectResizeHeight = createSelector(
  selectSingleChartState,
  (chartState) => chartState.resizeHeight,
)

export const selectChartPanAndZoom = createSelector(selectSingleChartState, prop("chartPanAndZoom"))

// count the nr of "success" or "failure" charts
const hasCompletedFetching = (chartState: ChartState) => chartState.isFetchDataFailure
  || Boolean(chartState.chartData) || chartState.isFetchDetailsFailure

export const selectAmountOfFetchedCharts = createSelector(
  selectChartsState,
  (chartsState) => Object.values(chartsState)
    .reduce((acc, chartState) => acc + (hasCompletedFetching(chartState) ? 1 : 0), 0),
)

export const selectAmountOfCharts = createSelector(
  selectChartsState,
  (chartsState) => Object.keys(chartsState).length,
)

export const selectNameOfAnyFetchingChart = createSelector(
  selectChartsState,
  (chartsState) => Object.values(chartsState)
    .find((chartState) => chartState.isFetchingData)?.chartId,
)

export const selectAmountOfSnapshotsFetched = createSelector(
  selectChartsState,
  (chartsState) => Object.values(chartsState)
    .reduce((acc, chartState) => acc + (chartState.snapshotData ? 1 : 0), 0),
)

export const selectAmountOfSnapshotsFailed = createSelector(
  selectChartsState,
  (chartsState) => Object.values(chartsState)
    .reduce((acc, chartState) => acc + (chartState.snapshotDataIsError ? 1 : 0), 0),
)
