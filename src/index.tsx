import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"

import { store } from "store"

// resolved in craco.config
// @ts-ignore
import App from "App"

import "./index.css"

// todo for static-dashboard:
// 1) wait for the whole page to load, then render
// 2) when the whole page is loaded, check window.NETDATA.options set by user and override initial
//    options settings

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
)
