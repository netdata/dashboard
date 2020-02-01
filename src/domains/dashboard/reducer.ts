import { createReducer } from "redux-act"
import { isSnapshotModeAction } from "domains/dashboard/actions"

export type StateT = {
  isSnapshotMode: boolean
}

export const initialState: StateT = {
  isSnapshotMode: false,
}

export const dashboardReducer = createReducer<StateT>({}, initialState)

dashboardReducer.on(isSnapshotModeAction, (state, isSnapshotMode) => ({
  ...state,
  isSnapshotMode,
}))
