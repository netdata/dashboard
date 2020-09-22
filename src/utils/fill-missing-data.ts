import { tail, sum } from "ramda"
import { ChartData, DygraphData } from "domains/chart/chart-types"

/*
when requesting for bigger time interval than available history in the agent,
we get only the available range. Dashboard was first designed to not allow zooming-out too much.
But we want to show the requested time-range, so to do it consistently, we return nr of points
when making the request, and after getting result, we add `null`s at the beginning
 */

interface GetCorrectedPointsArg {
  after: number
  before: number
  firstEntry: number
  points: number
}
export const getCorrectedPoints = ({
  after,
  before,
  firstEntry,
  points,
}: GetCorrectedPointsArg) => {
  const nowInSeconds = Math.round(new Date().valueOf() / 1000)
  const afterAbsolute = after > 0 ? after : (nowInSeconds + after)
  const beforeAbsolute = before > 0 ? before : (nowInSeconds + before)

  if (afterAbsolute < firstEntry) {
    // take into account first_entry
    const realAfter = Math.max(afterAbsolute, firstEntry)
    const requestedRange = beforeAbsolute - afterAbsolute
    const availableRange = beforeAbsolute - realAfter

    return Math.round((points * availableRange) / requestedRange)
  }
  return null
}

export const addPointsDygraph = (data: DygraphData, nrOfPointsToFill: number) => {
  const viewUpdateEvery = data.view_update_every
  if (!data.result.data.length) {
    return data
  }
  const firstAddedTimestamp = data.result.data[0][0] - nrOfPointsToFill * viewUpdateEvery
  const emptyPoint = tail(data.result.labels).map(() => null)
  const nulls = new Array(nrOfPointsToFill).fill(null)
    .map((_, i) => ([firstAddedTimestamp + i * viewUpdateEvery, ...emptyPoint]))
  return {
    ...data,
    after: data.after - viewUpdateEvery * nrOfPointsToFill,
    result: {
      ...data.result,
      data: nulls.concat(data.result.data),
    },
  }
}

export const fillMissingData = (data: ChartData, nrOfPointsToFill: number) => {
  if (data.format === "json") {
    return addPointsDygraph(data as DygraphData, nrOfPointsToFill)
  }
  return data
}

const emptyArray: number[] = []
export const transformResults = (data: ChartData, format: string) => {
  if (format === "array" && data.format === "json") {
    if (Array.isArray(data.result)) return data

    return {
      ...data,
      result: ((data as DygraphData).result.data).reduce((acc: number[], pointData: number[]) => {
        pointData.shift()
        return [
          ...acc,
          sum(pointData),
        ]
      }, emptyArray),
    }
  }
  return data
}

export const mapDefaultAggrMethod = (unit: string): string => {
  if (unit.length === 0) {
    return "sum"
  }
  const avgUnits: any = {
    percentage: true,
    percent: true,
    "rotations/min": true,
    ratio: true,
    seconds: true,
    "seconds ago": true,
    milliseconds: true,
    millisec: true,
    ms: true,
    "log2 s": true,
    minutes: true,
    hours: true,
    interval: true,
    ticks: true,
    celsius: true,
    c: true,
    mhz: true,
    hz: true,
    volts: true,
    kwh: true,
    ampere: true,
    amps: true,
    dbm: true,
    value: true,
    stratum: true,
    units: true,
    watt: true,
    temperature: true,
    "random number": true,
    rpm: true,
    quadro: true,
    "adv/item": true,
    multiplier: true,
    geforce: true,
  }
  if (avgUnits[unit.toLowerCase()]) {
    return "avg"
  }
  const avgUnitsRegExes: any = [
    ".*%.*",
    ".*/operation",
    ".*/run",
    ".*/ run",
    ".*/request",
  ]
  if (avgUnitsRegExes.some((regEx: string) => {
    const regExpression = RegExp(regEx, "i")
    return regExpression.test(unit.toLowerCase())
  })) {
    return "avg"
  }
  return "sum"
}
