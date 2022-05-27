import { leaveAtLeast1Decimal, unitsConversionCreator } from "./units-conversion"

const uuid = "12345"
const getConvertUnits = ({ min, max, units, callback }) =>
  unitsConversionCreator.get(uuid, min, max, units, "auto", undefined, callback, "celsius", true)

const MS_IN_MINUTE = 1000 * 60
const MS_IN_HOUR = 60 * MS_IN_MINUTE
const MS_IN_DAY = 24 * MS_IN_HOUR

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

describe("leaveAtLeast1Decimal", () => {
  it("returns single decimal given integer", () => {
    expect(leaveAtLeast1Decimal(5)).toEqual("5.0")
  })

  it("returns single decimal given float with single decimal", () => {
    expect(leaveAtLeast1Decimal(5.0)).toEqual("5.0")
    expect(leaveAtLeast1Decimal(5.5)).toEqual("5.5")
  })

  it("returns the same nr of decimals for floats with more than 1 decimal", () => {
    expect(leaveAtLeast1Decimal(5.01)).toEqual("5.01")
    expect(leaveAtLeast1Decimal(5.09)).toEqual("5.09")
    expect(leaveAtLeast1Decimal(5.009)).toEqual("5.009")
  })
})

describe("units conversion", () => {
  it("converts from milliseconds to microseconds", () => {
    const callback = jest.fn()
    const convertUnits = getConvertUnits({ min: 0.3, max: 0.9, units: "milliseconds", callback })
    expect(callback).toHaveBeenCalledWith("microseconds")
    expect(convertUnits(0.7)).toBe("700.00")
  })
  it("doesn't convert milliseconds for small numbers", () => {
    const callback = jest.fn()
    const convertUnits = getConvertUnits({ min: 1, max: 900, units: "milliseconds", callback })
    expect(callback).toHaveBeenCalledWith("milliseconds")
    expect(convertUnits(0.05)).toBe("0.05")
    expect(convertUnits(5)).toBe("5.00")
    expect(convertUnits(500)).toBe("500.00")
    expect(convertUnits(5000)).toBe("5000.00")
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
    expect(callback).toHaveBeenCalledWith("MM:SS.ms")
    expect(convertUnits(5)).toBe("00:00.01")
    expect(convertUnits(50)).toBe("00:00.05")
    expect(convertUnits(5000)).toBe("00:05.00")
    expect(convertUnits(5 * MS_IN_MINUTE)).toBe("05:00.00")
  })

  it("converts milliseconds for values > 1hour", () => {
    const callback = jest.fn()
    const convertUnits = getConvertUnits({
      min: 1,
      max: 5 * MS_IN_HOUR,
      units: "milliseconds",
      callback,
    })
    expect(callback).toHaveBeenCalledWith("HH:MM:SS.ms")
    expect(convertUnits(5)).toBe("00:00:00.01")
    expect(convertUnits(50)).toBe("00:00:00.05")
    expect(convertUnits(5000)).toBe("00:00:05.00")
    expect(convertUnits(86398999)).toBe("23:59:59.00")
    expect(convertUnits(5 * MS_IN_MINUTE)).toBe("00:05:00.00")
  })

  it("converts milliseconds for values > 1day", () => {
    const callback = jest.fn()
    const convertUnits = getConvertUnits({
      min: 1,
      max: 5 * MS_IN_DAY,
      units: "milliseconds",
      callback,
    })
    expect(callback).toHaveBeenCalledWith("dHH:MM:SS.ms")
    expect(convertUnits(5)).toBe("0d:00:00:00.01")
    expect(convertUnits(50)).toBe("0d:00:00:00.05")
    expect(convertUnits(5000)).toBe("0d:00:00:05.00")
    expect(convertUnits(86405000)).toBe("1d:00:00:05.00")
    expect(convertUnits(5 * MS_IN_MINUTE)).toBe("0d:00:05:00.00")
  })

  it("converts seconds down to milliseconds for max < 1", () => {
    const callback = jest.fn()
    const convertUnits = getConvertUnits({
      min: 0.3,
      max: 0.9,
      units: "seconds",
      callback,
    })
    expect(callback).toHaveBeenCalledWith("milliseconds")
    expect(convertUnits(0.002)).toBe("2.00")
    expect(convertUnits(0.9)).toBe("900.00")
  })

  it("converts seconds smaller than 1 minutes", () => {
    const callback = jest.fn()
    const convertUnits = getConvertUnits({ min: 1, max: 50, units: "seconds", callback })
    expect(callback).toHaveBeenCalledWith("seconds")
    expect(convertUnits(5)).toBe("5.00")
    expect(convertUnits(5.1)).toBe("5.10")
    expect(convertUnits(5.01)).toBe("5.01")
    expect(convertUnits(5.0019)).toBe("5.00")
    expect(convertUnits(5.009)).toBe("5.01")
    expect(convertUnits(5.0001)).toBe("5.00")
  })

  it("converts seconds higher than 1 minute", () => {
    const callback = jest.fn()
    const convertUnits = getConvertUnits({ min: 1, max: 20 * MINUTE, units: "seconds", callback })
    expect(callback).toHaveBeenCalledWith("MM:SS.ms")
    expect(convertUnits(5 * MINUTE)).toBe("05:00.00")
    expect(convertUnits(50 * MINUTE)).toBe("50:00.00")
  })

  it("converts seconds higher than 1 hour", () => {
    const callback = jest.fn()
    const convertUnits = getConvertUnits({ min: 1, max: 20 * HOUR, units: "seconds", callback })
    expect(callback).toHaveBeenCalledWith("HH:MM:SS.ms")
    expect(convertUnits(5 * MINUTE)).toBe("00:05:00.00")
    expect(convertUnits(50 * MINUTE)).toBe("00:50:00.00")
    expect(convertUnits(5 * HOUR)).toBe("05:00:00.00")
  })

  it("converts seconds higher than 1 day", () => {
    const callback = jest.fn()
    const convertUnits = getConvertUnits({ min: 1, max: 20 * DAY, units: "seconds", callback })
    expect(callback).toHaveBeenCalledWith("dHH:MM:SS.ms")
    expect(convertUnits(5 * MINUTE)).toBe("0d:00:05:00.00")
    expect(convertUnits(50 * MINUTE)).toBe("0d:00:50:00.00")
    expect(convertUnits(5 * HOUR)).toBe("0d:05:00:00.00")
    expect(convertUnits(50 * HOUR)).toBe("2d:02:00:00.00")
  })
})
