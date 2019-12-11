// needs to be included before bootstrap
import "domains/chart/utils/jquery-loader"

import "./cloud-settings"
import "./dashboard-react"

// todo support themes
import "./styles/dashboard.css"
import "./styles/bootstrap-3.3.7.css"

export {
  dashboardReduxContext,
  useDispatch as useDashboardDispatch,
  useSelector as useDashboardSelector,
} from "store/redux-separate-context"
export { store as dashboardStore } from "store"

export { ChartContainer } from "domains/chart/components/chart-container"
