import { identity } from "ramda"
import {
  useCallback, useState, useMemo, useRef,
} from "react"

import { unitsConversionCreator } from "utils/units-conversion"
import { safeEqualCheck } from "utils/safe-equal-check"

import { ChartData } from "../chart-types"
import { Attributes } from "./transformDataAttributes"

type Converter = (v: number) => number | string
// only time units are converted into strings, the rest are numbers

// todo - memoization similar to the one as in old dashboard, but probably not needed
const formattersFixed: any[] = []
const formattersZeroBased: any[] = []
const fastNumberFormat = (min: number, max: number) => {
  const key = max
  if (min === max) {
    if (typeof formattersFixed[key] === "undefined") {
      formattersFixed[key] = new Intl.NumberFormat(undefined, {
        useGrouping: true,
        minimumFractionDigits: min,
        maximumFractionDigits: max,
      })
    }

    return formattersFixed[key]
  } if (min === 0) {
    if (typeof formattersZeroBased[key] === "undefined") {
      formattersZeroBased[key] = new Intl.NumberFormat(undefined, {
        useGrouping: true,
        minimumFractionDigits: min,
        maximumFractionDigits: max,
      })
    }

    return formattersZeroBased[key]
  }
  // (old dashboard comment)
  // this is never used
  // it is added just for completeness
  return new Intl.NumberFormat(undefined, {
    useGrouping: true,
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  })
}

const getLegendFormatValue = (
  convertUnits: Converter, intlNumberFormat: Intl.NumberFormat | null, valueDecimalDetail: number,
) => (value: number | string | null) => {
  if (typeof value !== "number") {
    return "-"
  }

  const convertedValue = convertUnits(value)
  if (typeof convertedValue !== "number") {
    return convertedValue
  }

  if (intlNumberFormat !== null) {
    return intlNumberFormat.format(convertedValue)
  }

  let dmin
  let dmax
  if (valueDecimalDetail !== -1) {
    dmin = valueDecimalDetail
    dmax = valueDecimalDetail
  } else {
    dmin = 0
    const abs = (value < 0) ? -value : value
    if (abs > 1000) {
      dmax = 0
    } else if (abs > 10) {
      dmax = 1
    } else if (abs > 1) {
      dmax = 2
    } else if (abs > 0.1) {
      dmax = 2
    } else if (abs > 0.01) {
      dmax = 4
    } else if (abs > 0.001) {
      dmax = 5
    } else if (abs > 0.0001) {
      dmax = 6
    } else {
      dmax = 7
    }
  }

  return fastNumberFormat(dmin, dmax).format(value)
}

type LegendFormatValue = (value: string | number | null) => string | number

interface Arguments {
  attributes: Attributes,
  data: ChartData,
  units: string,
  unitsCommon: string | undefined,
  unitsDesired: string,
  uuid: string,
  temperatureSetting: "celsius" | "fahrenheit"
  secondsAsTimeSetting: boolean
}
export const useFormatters = ({
  attributes,
  data,
  units,
  unitsCommon,
  unitsDesired,
  uuid,
  temperatureSetting,
  secondsAsTimeSetting,
}: Arguments) => {
  // previously _unitsConversion
  const [convertUnits, setConvertUnits] = useState<Converter>(() => identity)

  // probably can also be removed
  const [min, setMin] = useState<number>()
  const [max, setMax] = useState<number>()

  // todo most of this state is not needed, that hook can be refractored
  const [unitsCurrent, setUnitsCurrent] = useState<string>(units)

  const [decimals, setDecimals] = useState<number>(-1)
  const [intlNumberFormat, setIntlNumberFormat] = useState<Intl.NumberFormat | null>(null)

  const {
    // "valueDecimalDetail" in old app
    decimalDigits = -1,
  } = attributes


  const legendFormatValue: LegendFormatValue = useMemo(() => (
    getLegendFormatValue(
      convertUnits, intlNumberFormat, decimalDigits,
    )
  ), [convertUnits, decimalDigits, intlNumberFormat])


  const legendFormatValueRef = useRef(legendFormatValue)
  const updateLegendFormatValueRef = (
    newConvertUnits: Converter, newIntlNumberFormat: any, newDecimalDigits: any,
  ) => {
    legendFormatValueRef.current = getLegendFormatValue(
      newConvertUnits, newIntlNumberFormat, newDecimalDigits,
    )
  }

  const legendFormatValueDecimalsFromMinMax = useCallback((newMin: number, newMax: number) => {
    if (safeEqualCheck(min, newMin) && safeEqualCheck(max, newMax)) {
      return legendFormatValueRef.current
    }
    // we should call the convertUnits-creation only when original app was doing this
    // so we don't get new updates in improper places
    setMin(newMin)
    setMax(newMax)

    const newConvertUnits = unitsConversionCreator.get(
      uuid, newMin, newMax, units, unitsDesired, unitsCommon,
      (switchedUnits) => {
        setUnitsCurrent(switchedUnits)
        // that.legendSetUnitsString(that.units_current);
        // that.legendSetUnitsString just populates some DOM with unitsCurrent
        // on all occurences just take the unitsCurrent from this state
      }, temperatureSetting, secondsAsTimeSetting,
    )

    // as function, so useState() interpretes it properly
    setConvertUnits(() => newConvertUnits)

    const convertedMin = newConvertUnits(newMin)
    const convertedMax = newConvertUnits(newMax)

    if (typeof convertedMin !== "number" || typeof convertedMax !== "number") {
      updateLegendFormatValueRef(newConvertUnits, intlNumberFormat, decimalDigits)
      return legendFormatValueRef.current
    }

    let newDecimals

    if (data.min === data.max) {
      // it is a fixed number, let the visualizer decide based on the value
      newDecimals = -1
    } else if (decimalDigits !== -1) {
      // there is an override
      newDecimals = decimalDigits
    } else {
      // ok, let's calculate the proper number of decimal points
      let delta

      if (convertedMin === convertedMax) {
        delta = Math.abs(convertedMin)
      } else {
        delta = Math.abs(convertedMax - convertedMin)
      }

      if (delta > 1000) {
        newDecimals = 0
      } else if (delta > 10) {
        newDecimals = (1)
      } else if (delta > 1) {
        newDecimals = 2
      } else if (delta > 0.1) {
        newDecimals = 2
      } else if (delta > 0.01) {
        newDecimals = 4
      } else if (delta > 0.001) {
        newDecimals = 5
      } else if (delta > 0.0001) {
        newDecimals = 6
      } else {
        newDecimals = 7
      }
    }


    let newIntlNumberFormat = intlNumberFormat

    if (newDecimals !== decimals) {
      if (newDecimals < 0) {
        newIntlNumberFormat = null
      } else {
        newIntlNumberFormat = fastNumberFormat(
          newDecimals,
          newDecimals,
        )
      }
      setIntlNumberFormat(() => newIntlNumberFormat)
      setDecimals(newDecimals)
    }
    updateLegendFormatValueRef(newConvertUnits, newIntlNumberFormat, newDecimals)
    return legendFormatValueRef.current
  }, [
    decimals, decimalDigits, min, max, uuid, temperatureSetting,
    units, unitsDesired, unitsCommon, secondsAsTimeSetting,
    data.min, data.max, intlNumberFormat,
  ])


  return {
    legendFormatValue,
    legendFormatValueDecimalsFromMinMax,
    unitsCurrent,
  }
}
