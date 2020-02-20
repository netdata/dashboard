import React from "react"
import ReactDOM from "react-dom"

import "../dashboard-react"

import App from "./custom-dashboards-app"

jest.mock("store/redux-separate-context", () => ({
  useDispatch: () => {},
  useSelector: () => {},
  useStore: () => {},
}))

jest.mock("domains/chart/components/portals")

it("renders without crashing", () => {
  const div = document.createElement("div")
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
