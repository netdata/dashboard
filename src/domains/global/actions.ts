import { createAction } from "redux-act"

import { createRequestAction } from "utils/createRequestAction"
import { RegistryMachine } from "domains/global/sagas"
import { storeKey } from "./constants"
import { ActiveAlarms, ChartsMetadata, Snapshot, Alarm, UserNodeAccessMessage } from "./types"

interface RequestCommonColors {
  chartContext: string
  chartUuid: string
  colorsAttribute: string | undefined
  commonColorsAttribute: string | undefined
  dimensionNames: string[]
}
export const requestCommonColorsAction = createAction<RequestCommonColors>(
  `${storeKey}/globalRequestCommonColors`
)

interface SetCommonMinAction {
  chartUuid: string
  commonMinKey: string
  value: number
}
export const setCommonMinAction = createAction<SetCommonMinAction>(`${storeKey}/setCommonMin`)

interface SetCommonMaxAction {
  chartUuid: string
  commonMaxKey: string
  value: number
}
export const setCommonMaxAction = createAction<SetCommonMaxAction>(`${storeKey}/setCommonMax`)

interface SetGlobalSelectionAction {
  chartUuid: string | null
  hoveredX: number
}
export const setGlobalSelectionAction = createAction<SetGlobalSelectionAction>(
  `${storeKey}/setGlobalSelection`
)

export interface SetGlobalPanAndZoomAction {
  after: number
  before: number
  masterID?: string
  shouldForceTimeRange?: boolean
}
export const setGlobalPanAndZoomAction = createAction<SetGlobalPanAndZoomAction>(
  `${storeKey}/setGlobalPanAndZoom`
)

export const resetGlobalPanAndZoomAction = createAction(`${storeKey}/resetGlobalPanAndZoomAction`)

export interface SetDefaultAfterAction {
  after: number
}
export const setDefaultAfterAction = createAction<SetDefaultAfterAction>(
  `${storeKey}/setDefaultAfterAction`
)

export const resetDefaultAfterAction = createAction(`${storeKey}/resetDefaultAfterAction`)

export interface SetGlobalChartUnderlayAction {
  after: number
  before: number
  masterID: string
}
export const setGlobalChartUnderlayAction = createAction<SetGlobalChartUnderlayAction>(
  `${storeKey}/setGlobalChartUnderlay`
)

export const centerAroundHighlightAction = createAction(`${storeKey}/centerAroundHighlightAction`)
export const clearHighlightAction = createAction(`${storeKey}/clearHighlightAction`)

interface WindowFocusChangeAction {
  hasWindowFocus: boolean
}
export const windowFocusChangeAction = createAction<WindowFocusChangeAction>(
  `${storeKey}/windowFocusChangeAction`
)

export interface FetchHelloPayload {
  serverDefault: string
}
/* eslint-disable camelcase */
export interface HelloResponse {
  action: "hello"
  anonymous_statistics: boolean
  cloud_base_url: string
  hostname: string
  machine_guid: string
  registry: string
  status: string
}
/* eslint-enable camelcase */

export const fetchHelloAction = createRequestAction<
  FetchHelloPayload,
  { cloudBaseURL: string; hostname: string; isCloudEnabled: boolean; machineGuid: string }
>(`${storeKey}/fetchHelloAction`)

interface UpdatePersonUrlsAction {
  personGuid: string
  registryMachines: { [key: string]: RegistryMachine }
  registryMachinesArray: RegistryMachine[]
}
export const updatePersonUrlsAction = createAction<UpdatePersonUrlsAction>(
  `${storeKey}/updatePersonUrlsAction`
)

export interface AccessRegistrySuccessAction {
  registryServer: string
}
export const accessRegistrySuccessAction = createAction<AccessRegistrySuccessAction>(
  `${storeKey}/accessRegistrySuccessAction`
)

export interface StartAlarmsPayload {
  serverDefault: string
}
export const startAlarmsAction = createAction<StartAlarmsPayload>(`${storeKey}/startAlarmsAction`)

export const fetchAllAlarmsAction = createRequestAction(`${storeKey}/fetchAllAlarmsAction`)

export interface UpdateActiveAlarmAction {
  activeAlarms: ActiveAlarms
}
export const updateActiveAlarmsAction = createAction<UpdateActiveAlarmAction>(
  `${storeKey}/updateActiveAlarmsAction`
)

export interface SetOptionAction {
  key: string
  value: unknown
}
export const setOptionAction = createAction<SetOptionAction>(`${storeKey}/setOptionAction`)

export const resetOptionsAction = createAction(`${storeKey}/resetOptions`)

export const loadSnapshotAction = createAction<{ snapshot: Snapshot }>(
  `${storeKey}/loadSnapshotAction`
)

export const chartsMetadataRequestSuccess = createAction<{ data: ChartsMetadata }>(
  `${storeKey}/chartsMetadataRequestSuccess`
)

export interface SetSpacePanelStatusActionPayload {
  isActive: boolean
}
export const setSpacePanelStatusAction = createAction<SetSpacePanelStatusActionPayload>(
  `${storeKey}/setSpacePanelStatusAction`
)

export interface SetSpacePanelTransitionEndPayload {
  isActive: boolean
}
export const setSpacePanelTransitionEndAction = createAction<SetSpacePanelTransitionEndPayload>(
  `${storeKey}/setSpacePanelStatusAction`
)

export const setAlarmAction = createAction<{ alarm: Alarm }>(`${storeKey}/setAlarmAction`)

export const resetRegistry = createAction(`${storeKey}/resetRegistry`)

export const setGlobalPauseAction = createAction(`${storeKey}/setGlobalPauseAction`)
export const resetGlobalPauseAction = createAction<{ forcePlay?: boolean }>(
  `${storeKey}/resetGlobalPauseAction`
)
export const setUTCOffset = createAction<{ utcOffset?: number | string }>(
  `${storeKey}/setUTCOffset`
)

export const setUserNodeAccess = createAction<{ message: UserNodeAccessMessage }>(
  `${storeKey}/setUserNodeAccess`
)
