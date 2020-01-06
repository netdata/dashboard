import React, { lazy, Suspense } from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"

import { store } from "store"

import "./index.css"

const CustomDashboardsApp = lazy(() => import("./custom-dashboards-app"))
const App = lazy(() => import("./App"))

const isMainJs = process.env.REACT_APP_IS_MAIN_DASHBOARD

if (isMainJs) {
// Dashboard
  ReactDOM.render(
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </Provider>,
    document.getElementById("root"),
  )
} else {
// Custom Dashboards
  ReactDOM.render(
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <CustomDashboardsApp />
      </Suspense>
    </Provider>,
    document.getElementById("root"),
  )
}
