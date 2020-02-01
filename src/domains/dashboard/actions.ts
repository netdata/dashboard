import { createAction } from "redux-act"

import { storeKey } from "./constants"

export const isSnapshotModeAction = createAction<boolean>(`${storeKey}isSnapshotModeAction`)
