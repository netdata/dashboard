import { createReducer } from "redux-act"

import { ChartsMetadata } from "domains/global/types"

import { startSnapshotModeAction, stopSnapshotModeAction, isSignedInAction, setOfflineAction } from "./actions"

export type StateT = {
  isSnapshotMode: boolean
  snapshotCharts: ChartsMetadata | null
  snapshotDataPoints: number | null
  isSignedIn: boolean
  offline: boolean
}

export const initialState: StateT = {
  isSnapshotMode: false,
  snapshotCharts: null,
  snapshotDataPoints: null,
  isSignedIn: true,
  offline: false
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

dashboardReducer.on(isSignedInAction, (state, { isSignedIn }) => ({
  ...state,
  isSignedIn
}))

dashboardReducer.on(setOfflineAction, (state, { offline }) => ({
  ...state,
  offline
}))
