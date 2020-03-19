import { combineReducers } from "redux"

import { globalReducer } from "domains/global/reducer"
import { storeKey as globalKey } from "domains/global/constants"

import { chartReducer } from "domains/chart/reducer"
import { storeKey as chartKey } from "domains/chart/constants"

import { dashboardReducer } from "domains/dashboard/reducer"
import { storeKey as dashboardKey } from "domains/dashboard/constants"

export default combineReducers({
  [globalKey]: globalReducer,
  [chartKey]: chartReducer,

  // todo lazy-load and inject those reducers, when they are not needed (dashboard.js, cloud)
  [dashboardKey]: dashboardReducer,
})
