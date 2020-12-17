import { chartReducer, initialState } from "./reducer"
import { fetchDataAction } from "./actions"

const chart1ID = "chart1ID"

describe("chart reducer", () => {
  describe("fetchDataAction.success", () => {
    it("keeps unchanged values after update", () => {
      expect(true).toBe(true)
      const fetchDataParams = {}
      const result1 = chartReducer(initialState, fetchDataAction.success({
        chartData: {
          dimension_names: ["dim1", "dim2"],
          result: ["val1", "val2"],
        },
        fetchDataParams,
        id: chart1ID,
      }))
      const result2 = chartReducer(result1, fetchDataAction.success({
        chartData: {
          dimension_names: ["dim1", "dim2"],
          result: ["val3", "val4"],
        },
        fetchDataParams,
        id: chart1ID,
      }))
      expect(
        result1[chart1ID].chartData!.dimension_names,
      ).toBe(
        result2[chart1ID].chartData!.dimension_names,
      )
    })

    it("replaces changed values after update", () => {
      expect(true).toBe(true)
      const fetchDataParams = {}
      const result1 = chartReducer(initialState, fetchDataAction.success({
        chartData: {
          dimension_names: ["dim1", "dim2"],
          result: ["val1", "val2"],
        },
        fetchDataParams,
        id: chart1ID,
      }))

      const newDimensionNames = ["dim1", "dim3"]
      const result2 = chartReducer(result1, fetchDataAction.success({
        chartData: {
          dimension_names: newDimensionNames,
          result: ["val3", "val4"],
        },
        fetchDataParams,
        id: chart1ID,
      }))
      expect(
        result2[chart1ID].chartData!.dimension_names,
      ).toBe(newDimensionNames)
    })
  })
})
