import { createAction } from "redux-act"
import { ChartsMetadata } from "domains/global/types"

import { storeKey } from "./constants"

export interface startSnapshotModeAction {
  charts: ChartsMetadata
  dataPoints: number
}
export const startSnapshotModeAction = createAction<startSnapshotModeAction>(
  `${storeKey}/isSnapshotModeAction`,
)

export const stopSnapshotModeAction = createAction(`${storeKey}/stopSnapshotModeAction`)
