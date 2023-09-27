import { createAction } from "redux-act"
import { ChartsMetadata } from "domains/global/types"

import { storeKey } from "./constants"

interface IStartSnapshotModeAction {
  charts: ChartsMetadata
  dataPoints: number
}
export const startSnapshotModeAction = createAction<IStartSnapshotModeAction>(
  `${storeKey}/isSnapshotModeAction`,
)

export const stopSnapshotModeAction = createAction(`${storeKey}/stopSnapshotModeAction`)

export interface ShowSignInModalAction { signInLinkHref: string }
export const showSignInModalAction = createAction<ShowSignInModalAction>(
  `${storeKey}/showSignInModal`,
)

export const explicitlySignInAction = createAction(`${storeKey}/explicitlySignIn`)

export interface IsSignedInAction { isSignedIn: boolean }
export const isSignedInAction = createAction<IsSignedInAction>(`${storeKey}/isSignedInAction`)

export interface SetOfflineAction { offline: boolean }
export const setOfflineAction = createAction<SetOfflineAction>(`${storeKey}/setOfflineAction`)
