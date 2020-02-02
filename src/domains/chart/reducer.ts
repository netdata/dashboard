import { omit } from "ramda"
import { createReducer } from "redux-act"

import {
  fetchDataAction, fetchChartAction, setResizeHeightAction,
  clearChartStateAction, fetchDataForSnapshotAction,
} from "./actions"
import { ChartState } from "./chart-types"

export type StateT = {
  [chartID: string]: ChartState
}

export const initialState = {
}
export const initialSingleState = {
  chartData: null,
  chartDetails: null,
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
}

export const chartReducer = createReducer<StateT>(
  {},
  initialState,
)

const getSubstate = (state: StateT, id: string) => state[id] || initialSingleState

chartReducer.on(fetchDataAction.request, (state, { id }) => ({
  ...state,
  [id]: {
    ...getSubstate(state, id),
    isFetchingData: true,
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

chartReducer.on(fetchDataAction.success, (state, { id, chartData, fetchDataParams }) => ({
  ...state,
  [id]: {
    ...getSubstate(state, id),
    chartData,
    fetchDataParams,
    isFetchingData: false,
    isFetchDataFailure: false,
  },
}))


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

chartReducer.on(fetchChartAction.success, (state, { id, chartDetails }) => ({
  ...state,
  [id]: {
    ...getSubstate(state, id),
    chartDetails,
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

chartReducer.on(clearChartStateAction, (state, { id }) => omit([id], state))
