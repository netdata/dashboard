import {
  map, omit, assoc, pick,
} from "ramda"
import { createReducer } from "redux-act"

import { setOptionAction } from "domains/global/actions"
import { SYNC_PAN_AND_ZOOM } from "domains/global/options"
import { useNewKeysOnlyIfDifferent } from "utils/utils"

import {
  fetchDataAction,
  fetchChartAction,
  setResizeHeightAction,
  clearChartStateAction,
  fetchDataForSnapshotAction,
  snapshotExportResetAction,
  setChartPanAndZoomAction,
  resetChartPanAndZoomAction,
  fetchDataCancelAction,
} from "./actions"
import { ChartState } from "./chart-types"

export type StateT = {
  [chartID: string]: ChartState
}

export const initialState = {
}
export const initialSingleState = {
  chartData: null,
  chartId: null,
  chartMetadata: null,
  chartPanAndZoom: null,
  fetchDataParams: {
    isRemotelyControlled: false,
    viewRange: null,
  },
  isFetchingData: false,
  isFetchDataFailure: false,
  isFetchDetailsFailure: false,
  isFetchingDetails: false,
  resizeHeight: null,

  snapshotDataIsFetching: false,
  snapshotDataIsError: false,
  snapshotData: null,
  viewRange: null,
}

export const chartReducer = createReducer<StateT>(
  {},
  initialState,
)

export const getSubstate = (state: StateT, id: string) => state[id] || initialSingleState

chartReducer.on(fetchDataAction.request, (state, { chart, fetchDataParams, id }) => ({
  ...state,
  [id]: {
    ...getSubstate(state, id),
    chartId: chart,
    isFetchingData: true,
    viewRange: fetchDataParams.viewRange,
  },
}))

chartReducer.on(fetchDataCancelAction, (state, { id }) => ({
  ...state,
  [id]: {
    ...getSubstate(state, id),
    isFetchingData: false,
  },
}))

chartReducer.on(fetchDataAction.failure, (state, { id }) => ({
  ...state,
  [id]: {
    ...getSubstate(state, id),
    isFetchingData: false,
    isFetchDataFailure: true,
  },
}))

chartReducer.on(fetchDataAction.success, (state, { id, chartData, fetchDataParams }) => {
  const substate = getSubstate(state, id)
  return {
    ...state,
    [id]: {
      ...substate,
      chartData: useNewKeysOnlyIfDifferent(["dimension_names"], substate.chartData, chartData!),
      fetchDataParams,
      isFetchingData: false,
      isFetchDataFailure: false,
      viewRange: fetchDataParams.viewRange,
    },
  }
})


chartReducer.on(fetchDataForSnapshotAction.request, (state, { id }) => ({
  ...state,
  [id]: {
    ...getSubstate(state, id),
    snapshotDataIsFetching: true,
  },
}))

chartReducer.on(fetchDataForSnapshotAction.failure, (state, { id }) => ({
  ...state,
  [id]: {
    ...getSubstate(state, id),
    snapshotDataIsFetching: false,
    snapshotDataIsError: true,
  },
}))

chartReducer.on(fetchDataForSnapshotAction.success, (state, { id, snapshotData }) => ({
  ...state,
  [id]: {
    ...getSubstate(state, id),
    snapshotDataIsFetching: false,
    snapshotDataIsError: false,
    snapshotData,
  },
}))

chartReducer.on(snapshotExportResetAction, (state) => map((substate) => ({
  ...substate,
  ...pick(["snapshotDataIsFetching", "snapshotDataIsError", "snapshotData"], initialSingleState),
}), state))


chartReducer.on(fetchChartAction.request, (state, { id }) => ({
  ...state,
  [id]: {
    ...getSubstate(state, id),
    isFetchingDetails: true,
  },
}))

chartReducer.on(fetchChartAction.failure, (state, { id }) => ({
  ...state,
  [id]: {
    ...getSubstate(state, id),
    isFetchDetailsFailure: true,
  },
}))

chartReducer.on(fetchChartAction.success, (state, { id, chartMetadata }) => ({
  ...state,
  [id]: {
    ...getSubstate(state, id),
    chartMetadata,
    isFetchingDetails: false,
    isFetchDetailsFailure: false,
  },
}))

// todo handle errors without creating a loop
// chartReducer.on(fetchChartAction.failure, (state, { id }) => ({
//   ...state,
//   [id]: {
//     ...getSubstate(state, id),
//     isFetchingDetails: false,
//   },
// }))

chartReducer.on(setResizeHeightAction, (state, { id, resizeHeight }) => ({
  ...state,
  [id]: {
    ...getSubstate(state, id),
    resizeHeight,
  },
}))

chartReducer.on(setChartPanAndZoomAction, (state, {
  after, before, id, shouldForceTimeRange,
}) => ({
  ...state,
  [id]: {
    ...getSubstate(state, id),
    chartPanAndZoom: { after, before, shouldForceTimeRange },
  },
}))

chartReducer.on(resetChartPanAndZoomAction, (state, { id }) => ({
  ...state,
  [id]: {
    ...getSubstate(state, id),
    chartPanAndZoom: initialSingleState.chartPanAndZoom,
  },
}))

chartReducer.on(setOptionAction, (state, { key, value }) => {
  // clear chartPanAndZoom, when SYNC_PAN_AND_ZOOM flag is turned on
  if (key === SYNC_PAN_AND_ZOOM && value === true) {
    return map(
      assoc("chartPanAndZoom", initialSingleState.chartPanAndZoom),
      state,
    )
  }
  return state
})

chartReducer.on(clearChartStateAction, (state, { id }) => omit([id], state))
