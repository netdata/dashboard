import { createAction } from "redux-act"

import { createRequestAction } from "utils/createRequestAction"
import { RegistryMachine } from "domains/global/sagas"
import { storeKey } from "./constants"
import { ActiveAlarms, ChartsMetadata, Snapshot } from "./types"

interface RequestCommonColors {
  chartContext: string
  chartUuid: string
  colorsAttribute: string | undefined
  commonColorsAttribute: string | undefined
  dimensionNames: string[]
}
export const requestCommonColorsAction = createAction<RequestCommonColors>(
  `${storeKey}/globalRequestCommonColors`,
)

export const setTimezoneAction = createAction<{timezone: string}>(`${storeKey}/globalSetTmezone`)
window.TEMPORARY_setTimezoneAction = setTimezoneAction

interface SetGlobalSelectionAction {
  chartUuid: string | null
  hoveredX: number
}
export const setGlobalSelectionAction = createAction<SetGlobalSelectionAction>(
  `${storeKey}/setGlobalSelection`,
)

interface SetGlobalPanAndZoomAction {
  after: number
  before: number
  masterID?: string
  shouldForceTimeRange?: boolean
}
export const setGlobalPanAndZoomAction = createAction<SetGlobalPanAndZoomAction>(
  `${storeKey}/setGlobalPanAndZoom`,
)

export const resetGlobalPanAndZoomAction = createAction(`${storeKey}/resetGlobalPanAndZoomAction`)

interface SetGlobalChartUnderlayAction {
  after: number
  before: number
  masterID: string
}
export const setGlobalChartUnderlayAction = createAction<SetGlobalChartUnderlayAction>(
  `${storeKey}/setGlobalChartUnderlay`,
)

export const centerAroundHighlightAction = createAction(`${storeKey}/centerAroundHighlightAction`)
export const clearHighlightAction = createAction(`${storeKey}/clearHighlightAction`)

interface WindowFocusChangeAction {
  hasWindowFocus: boolean
}
export const windowFocusChangeAction = createAction<WindowFocusChangeAction>(
  `${storeKey}/windowFocusChangeAction`,
)

export interface FetchHelloPayload {
  serverDefault: string,
}

export const fetchHelloAction = createRequestAction<
  FetchHelloPayload,
  { cloudBaseURL: string, hostname: string, isCloudEnabled: boolean, machineGuid: string,
    registryServer: string }
  >(`${storeKey}/fetchHelloAction`)


interface UpdatePersonUrlsAction {
  personGuid: string
  registryMachines: {[key: string]: RegistryMachine}
  registryMachinesArray: RegistryMachine[]
}
export const updatePersonUrlsAction = createAction<UpdatePersonUrlsAction>(
  `${storeKey}/updatePersonUrlsAction`,
)

export interface StartAlarmsPayload { serverDefault: string }
export const startAlarmsAction = createAction<StartAlarmsPayload>(
  `${storeKey}/startAlarmsAction`,
)

export const fetchAllAlarmsAction = createRequestAction(`${storeKey}/fetchAllAlarmsAction`)

export interface UpdateActiveAlarmAction { activeAlarms: ActiveAlarms }
export const updateActiveAlarmsAction = createAction<UpdateActiveAlarmAction>(
  `${storeKey}/updateActiveAlarmsAction`,
)

export interface SetOptionAction {
  key: string
  value: unknown
}
export const setOptionAction = createAction<SetOptionAction>(
  `${storeKey}/setOptionAction`,
)

export const loadSnapshotAction = createAction<{snapshot: Snapshot}>(
  `${storeKey}/loadSnapshotAction`,
)

export const chartsMetadataRequestSuccess = createAction<{ data: ChartsMetadata }>(
  `${storeKey}/chartsMetadataRequestSuccess`,
)
