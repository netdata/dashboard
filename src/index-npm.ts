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

// Cannot re-export a type when the --isolatedModules flag is provided
import { Attributes } from "domains/chart/utils/transformDataAttributes"

window.Ps = Ps

export type ChartAttributes = Attributes

export {
  dashboardReduxContext,
  useDispatch as useDashboardDispatch,
  useSelector as useDashboardSelector,
} from "store/redux-separate-context"
export { store as dashboardStore } from "store"

export { ChartContainer } from "domains/chart/components/chart-container"

export { NodeView } from "domains/dashboard/components/node-view"

export { resetGlobalPanAndZoomAction, setGlobalPanAndZoomAction } from "domains/global/actions"

export { VersionControl } from "components/app-header/components/version-control"
