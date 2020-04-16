import { createAction } from "redux-act"
import { CancelTokenSource } from "axios"

import { createRequestAction } from "utils/createRequestAction"

import { storeKey } from "./constants"
import { ChartData, ChartMetadata } from "./chart-types"

export interface UpdateChartDataAction {
  chartData: ChartData
  id: string
}
export const updateChartDataAction = createAction<UpdateChartDataAction>(
  `${storeKey}/updateChartData`,
)

export interface UpdateChartMetadataAction {
  chartMetadata: ChartMetadata
  id: string
}
export const updateChartMetadataAction = createAction<UpdateChartMetadataAction>(
  `${storeKey}/updateChartMetadata`,
)

export interface FetchDataParams {
  isRemotelyControlled: boolean
  viewRange: [number, number]
}
export interface FetchDataUrlParams {
  host: string,
  chart: string,
  format: string,
  points: number,
  group: string,
  gtime: number,
  options: string,
  after: number | null,
  before?: number | null,
  dimensions?: string,
}
export interface FetchDataPayload extends FetchDataUrlParams {
  id: string,
  fetchDataParams: FetchDataParams
  cancelTokenSource: CancelTokenSource
}

export const fetchDataAction = createRequestAction<
  FetchDataPayload,
  { id: string, chartData: ChartData, fetchDataParams: FetchDataParams }
>(`${storeKey}/fetchDataAction`)


export interface FetchDataForSnapshotPayload extends FetchDataUrlParams {
  chartLibrary: string
  id: string
}
export const fetchDataForSnapshotAction = createRequestAction<
  FetchDataForSnapshotPayload,
  { id: string, snapshotData: ChartData }
>(`${storeKey}/fetchDataForSnapshotAction`)

export interface FetchChartPayload {
  chart: string
  id: string
  host: string
}

export const fetchChartAction = createRequestAction<
  FetchChartPayload,
  { chartMetadata: ChartMetadata, id: string }
>(`${storeKey}/fetchChartAction`)


export interface SetResizeHeightAction {
  id: string
  resizeHeight: number
}
export const setResizeHeightAction = createAction<SetResizeHeightAction>(
  `${storeKey}/setResizeHeight`,
)

export interface SetChartPanAndZoomAction {
  id: string
  after: number
  before: number
  shouldForceTimeRange?: boolean
}
export const setChartPanAndZoomAction = createAction<SetChartPanAndZoomAction>(
  `${storeKey}/setChartPanAndZoom`,
)

export const resetChartPanAndZoomAction = createAction<{ id: string }>(
  `${storeKey}/resetChartPanAndZoomAction`,
)

export const clearChartStateAction = createAction<{ id: string }>(
  `${storeKey}/clearChartStateAction`,
)

export interface FetchInfoPayload {
  poll?: boolean
}
export interface FetchInfoSuccessPayload {
  isCloudAvailable: boolean
  isCloudEnabled: boolean
  isAgentClaimed: boolean
  isACLKAvailable: boolean
}
export const fetchInfoAction = createRequestAction<
  FetchInfoPayload,
  FetchInfoSuccessPayload
>(`${storeKey}/fetchInfoAction`)
