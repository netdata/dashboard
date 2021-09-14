// needs to be included before bootstrap
import "domains/chart/utils/jquery-loader"
import Ps from "perfect-scrollbar"

import "types/global"

import "./cloud-settings"

// those paths are a result of multi-purpose of this repository. 1) static custom dashboards
// 2) main Dashboard, 3) cloud npm package
import "../dashboard-react"
// todo support themes
import "./styles/bootstrap-3.3.7.css"
import "./styles/dashboard.css"

import "@fortawesome/fontawesome-free/js/all"

window.Ps = Ps

export {
  dashboardReduxContext,
  useDispatch as useDashboardDispatch,
  useSelector as useDashboardSelector,
} from "store/redux-separate-context"
export { store as dashboardStore } from "store"

export { default as useAlarmFromUrl } from "domains/dashboard/hooks/useAlarmFromUrl"
export { ChartContainer } from "domains/chart/components/chart-container"

export { NodeView } from "domains/dashboard/components/node-view"
export { default as DashboardCharts } from "domains/dashboard/components/node-view/dashboardCharts"
export { default as useCurrentChart } from "domains/dashboard/components/node-view/useCurrentChart"
export { default as useMenu } from "domains/dashboard/components/node-view/useMenu"
export * from "domains/dashboard/components/node-view/use-update-theme"
export * from "domains/dashboard/components/head-main"
export { default as HeadMainContainer } from "domains/dashboard/components/headMainContainer"
export * from "domains/dashboard/components/virtualized"
export * from "utils/hash-utils"
export * from "utils/date-time"

export * from "domains/charts"

export { getNodeChartAttributes } from "utils/get-node-chart-attributes"

export {
  resetGlobalPanAndZoomAction,
  setGlobalPanAndZoomAction,
  setOptionAction,
  setGlobalChartUnderlayAction,
  centerAroundHighlightAction,
  clearHighlightAction,
  setSpacePanelTransitionEndAction,
  setDefaultAfterAction,
  setAlarmAction,
  resetGlobalPauseAction,
  setGlobalPauseAction,
  setUTCOffset,
} from "domains/global/actions"
export {
  selectStopUpdatesWhenFocusIsLost,
  selectDestroyOnHide,
  selectDefaultAfter,
  selectGlobalPanAndZoom,
  selectGlobalPause,
  selectAlarm,
  selectHasWindowFocus,
  selectGlobalSelection,
  selectUTCOffsetSetting,
  selectTimezoneSetting,
} from "domains/global/selectors"
export { selectChartData, selectChartsAreFetching } from "domains/chart/selectors"
export { STOP_UPDATES_WHEN_FOCUS_IS_LOST, DESTROY_ON_HIDE } from "domains/global/options"

export { default as VersionControl } from "components/app-header/components/versionControl"

/**
 * types
 */

/* eslint-disable import/first,import/newline-after-import */
// Cannot re-export a type when the --isolatedModules flag is provided
import {
  Attributes,
  ChartsAttributes as ChartsAttributes_,
} from "domains/chart/utils/transformDataAttributes"
export type ChartAttributes = Attributes
export type ChartsAttributes = ChartsAttributes_

import { ChartMetadata as ChartMetadata_ } from "domains/chart/chart-types"
export type ChartMetadata = ChartMetadata_

import { ChartsMetadata as ChartsMetadata_ } from "domains/global/types"
export type ChartsMetadata = ChartsMetadata_

import { RenderCustomElementForDygraph as RenderCustomElementForDygraph_ } from "domains/chart/components/chart-with-loader"
export type RenderCustomElementForDygraph = RenderCustomElementForDygraph_

import { AppStateT as AppStateT_ } from "store/app-state"

export type DashboardStateT = AppStateT_

/* eslint-enable import/first,import/newline-after-import */

export { DashboardThemeProvider } from "./theme-provider"
export { mapDefaultAggrMethod } from "utils/fill-missing-data"

export * from "domains/chart/components/lib-charts/group-box-chart"
