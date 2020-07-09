// needs to be included before bootstrap
import "domains/chart/utils/jquery-loader"
import Ps from "perfect-scrollbar"

import "types/global"

import "./cloud-settings"

// those paths are a result of multi-purpose of this repository. 1) static custom dashboards
// 2) main Dashboard, 3) cloud npm package
import "../dashboard-react"
// todo support themes
import "./styles/dashboard.css"
import "./styles/bootstrap-3.3.7.css"

import "vendor/fontawesome-all-5.0.1.min"

window.Ps = Ps

export {
  dashboardReduxContext,
  useDispatch as useDashboardDispatch,
  useSelector as useDashboardSelector,
} from "store/redux-separate-context"
export { store as dashboardStore } from "store"

export { ChartContainer } from "domains/chart/components/chart-container"

export { NodeView } from "domains/dashboard/components/node-view"

export {
  resetGlobalPanAndZoomAction, setGlobalPanAndZoomAction, setOptionAction,
} from "domains/global/actions"
export { selectStopUpdatesWhenFocusIsLost, selectDestroyOnHide } from "domains/global/selectors"
export { STOP_UPDATES_WHEN_FOCUS_IS_LOST, DESTROY_ON_HIDE } from "domains/global/options"

export { VersionControl } from "components/app-header/components/version-control"

/**
 * types
 */

/* eslint-disable import/first,import/newline-after-import */
// Cannot re-export a type when the --isolatedModules flag is provided
import { Attributes } from "domains/chart/utils/transformDataAttributes"
export type ChartAttributes = Attributes

import { ChartMetadata as ChartMetadata_ } from "domains/chart/chart-types"
export type ChartMetadata = ChartMetadata_

import { ChartsMetadata as ChartsMetadata_ } from "domains/global/types"
export type ChartsMetadata = ChartsMetadata_
/* eslint-enable import/first,import/newline-after-import */
