import { createReducer } from "redux-act"

import { ChartsMetadata } from "domains/global/types"

import { startSnapshotModeAction, stopSnapshotModeAction } from "./actions"

export type StateT = {
  isSnapshotMode: boolean
  snapshotCharts: ChartsMetadata | null
  snapshotDataPoints: number | null
}

export const initialState: StateT = {
  isSnapshotMode: false,
  snapshotCharts: null,
  snapshotDataPoints: null,
}

export const dashboardReducer = createReducer<StateT>({}, initialState)

dashboardReducer.on(startSnapshotModeAction, (state, { charts, dataPoints }) => ({
  ...state,
  snapshotCharts: charts, // todo integrate with /charts result
  snapshotDataPoints: dataPoints,
  isSnapshotMode: true,
}))

dashboardReducer.on(stopSnapshotModeAction, (state) => ({
  ...state,
  isSnapshotMode: initialState.isSnapshotMode,
  snapshotCharts: initialState.snapshotCharts,
  snapshotDataPoints: initialState.snapshotDataPoints,
}))
