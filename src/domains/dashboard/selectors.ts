import { prop } from "ramda"
import { createSelector } from "reselect"

import { AppStateT } from "store/app-state"

import { storeKey } from "./constants"

const selectDashboardDomain = (state: AppStateT) => state[storeKey]

export const selectIsSnapshotMode = createSelector(
  selectDashboardDomain,
  prop("isSnapshotMode"),
)
