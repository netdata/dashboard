import { DygraphData } from "domains/chart/chart-types"
import { addPointsDygraph } from "./fill-missing-data"

const dygraphData = {
  after: 1600000221,
  view_update_every: 1,
  result: {
    data: [
      [1600000222, 100],
      [1600000223, 100],
      [1600000224, 100],
    ],
    labels: ["time", "dimension1"],
  },
}

const dygraphDataMultipleDimensions = {
  after: 1600000221,
  view_update_every: 1,
  result: {
    data: [
      [1600000222, 100, 100, 100],
      [1600000223, 100, 100, 100],
      [1600000224, 100, 100, 100],
    ],
    labels: ["time", "dimension1", "dimension2", "dimension3"],
  },
}

const dygraphDataEmpty = {
  after: 1600000221,
  view_update_every: 3,
  result: {
    data: ([] as number[][]),
    labels: ["time", "no data"],
  },
}

describe("fill missing data", () => {
  describe("addPointsDygraph", () => {
    it("fill nulls with proper timestamps", () => {
      const output = addPointsDygraph(dygraphData as DygraphData, 3)
      expect(output.result.data).toStrictEqual([
        [1600000219, null],
        [1600000220, null],
        [1600000221, null],
        [1600000222, 100],
        [1600000223, 100],
        [1600000224, 100],
      ])
    })
    it("fill proper nr of nulls (respect dimension numbers)", () => {
      const output = addPointsDygraph(dygraphDataMultipleDimensions as DygraphData, 3)
      expect(output.result.data).toStrictEqual([
        [1600000219, null, null, null],
        [1600000220, null, null, null],
        [1600000221, null, null, null],
        [1600000222, 100, 100, 100],
        [1600000223, 100, 100, 100],
        [1600000224, 100, 100, 100],
      ])
    })
    it("after param is updated accordingly", () => {
      const output = addPointsDygraph(dygraphDataMultipleDimensions as DygraphData, 3)
      expect(output.after).toBe(dygraphDataMultipleDimensions.after - 3)
    })
    it("returns the same object when there's no data at all", () => {
      const output = addPointsDygraph(dygraphDataEmpty as DygraphData, 3)
      expect(output).toBe(dygraphDataEmpty)
    })
  })
})
