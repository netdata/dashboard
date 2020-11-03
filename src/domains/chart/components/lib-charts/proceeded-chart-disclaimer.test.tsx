import React from "react"
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from "@testing-library/react"
import ProceededChartDisclaimer from "./proceeded-chart-disclaimer"

it("renders", () => {
  const { getByTestId } = render(<ProceededChartDisclaimer />)
  expect(getByTestId("proceededChartDisclaimer")).not.toBe(null)
})
