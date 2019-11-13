import React, { lazy, Suspense } from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"

import { configureStore } from "store"

import "./index.css"
import * as serviceWorker from "./serviceWorker"

const CustomDashboardsApp = lazy(() => import("./custom-dashboards-app"))
const App = lazy(() => import("./App"))

const store = configureStore()

if (process.env.REACT_APP_IS_MAIN_DASHBOARD) {
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


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
