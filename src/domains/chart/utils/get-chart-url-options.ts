import { Attributes } from "domains/chart/utils/transformDataAttributes"
import { chartLibrariesSettings } from "domains/chart/utils/chartLibrariesSettings"

export const getChartURLOptions = (
  attributes: Attributes, shouldEliminateZeroDimensions: boolean,
) => {
  const {
    appendOptions,
    overrideOptions,
  } = attributes
  let ret = ""

  ret += overrideOptions
    ? overrideOptions.toString()
    : chartLibrariesSettings[attributes.chartLibrary].options(attributes)

  if (typeof appendOptions === "string") {
    ret += `|${encodeURIComponent(appendOptions)}`
  }

  ret += "|jsonwrap"

  if (shouldEliminateZeroDimensions) {
    ret += "|nonzero"
  }

  if (attributes.dimensionsAggrMethod === "sum-of-abs"
  || (!attributes.dimensionsAggrMethod && attributes.groupBy && attributes.groupBy !== "dimension")
  ) {
    ret += "|absolute"
  }

  return ret
}
