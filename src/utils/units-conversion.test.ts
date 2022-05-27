import { unitsConversionCreator } from "./units-conversion"

const uuid = "12345"
const getConvertUnits = ({ min, max, units, callback }) =>
  unitsConversionCreator.get(uuid, min, max, units, "auto", undefined, callback, "celsius", true)

const MS_IN_MINUTE = 1000 * 60
const MS_IN_HOUR = 60 * MS_IN_MINUTE
const MS_IN_DAY = 24 * MS_IN_HOUR

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

describe("units conversion", () => {
  it("doesn't convert milliseconds for small numbers", () => {
    const callback = jest.fn()
    const convertUnits = getConvertUnits({ min: 1, max: 900, units: "milliseconds", callback })
    expect(callback).toHaveBeenCalledWith("milliseconds")
    expect(convertUnits(5)).toBe("5.0")
    expect(convertUnits(5000)).toBe("5000.0")
  })

  it("convert milliseconds for max > 1000", () => {
    const callback = jest.fn()
    const convertUnits = getConvertUnits({
      min: 3,
      max: 6000,
      units: "milliseconds",
      callback,
    })
    expect(callback).toHaveBeenCalledWith("seconds")
    // todo should be fixed!
    expect(convertUnits(5)).toBe("0.01")
    expect(convertUnits(5000)).toBe("5.00")
  })

  it("converts milliseconds for values > 1min", () => {
    const callback = jest.fn()
    const convertUnits = getConvertUnits({
      min: 1,
      max: 5 * MS_IN_MINUTE,
      units: "milliseconds",
      callback,
    })
    expect(callback).toHaveBeenCalledWith("M:SS.ms")
    expect(convertUnits(5)).toBe("0:00.01")
    expect(convertUnits(50)).toBe("0:00.05")
    expect(convertUnits(5000)).toBe("0:05.00")
    expect(convertUnits(5 * MS_IN_MINUTE)).toBe("5:00.00")
  })
})
