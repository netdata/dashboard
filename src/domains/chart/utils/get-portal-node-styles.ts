import { LOCALSTORAGE_HEIGHT_KEY_PREFIX } from "domains/chart/components/resize-handler"

import { LEGEND_BOTTOM_SINGLE_LINE_HEIGHT } from "domains/chart/utils/legend-utils"
import { Attributes } from "./transformDataAttributes"
import { ChartLibraryConfig } from "./chartLibrariesSettings"

type GetPortalNodeStyles = (
  attributes: Attributes,
  chartSettings: ChartLibraryConfig,
  shouldAddSpecialHeight: boolean,
) => {
  height: string | undefined,
  width: string | undefined,
  minWidth: string | undefined
}

const getHeightFromLocalStorage = (heightID: string, isLegendOnBottom: boolean) => {
  const persitedHeight = localStorage.getItem(`${LOCALSTORAGE_HEIGHT_KEY_PREFIX}${heightID}`)
  if (persitedHeight) {
    if (Number.isNaN(Number(persitedHeight))) {
      return null
    }
    return `${isLegendOnBottom
      ? Number(persitedHeight) + LEGEND_BOTTOM_SINGLE_LINE_HEIGHT
      : persitedHeight
    }px`
  }

  return null
}

export const getPortalNodeStyles: GetPortalNodeStyles = (
  attributes,
  chartSettings,
  shouldAddSpecialHeight,
) => {
  let width
  if (typeof attributes.width === "string") {
    // eslint-disable-next-line prefer-destructuring
    width = attributes.width
  } else if (typeof attributes.width === "number") {
    width = `${attributes.width.toString()}px`
  }
  let height
  if (chartSettings.aspectRatio === undefined) {
    if (typeof attributes.height === "string") {
      // eslint-disable-next-line prefer-destructuring
      height = attributes.height
    } else if (typeof attributes.height === "number") {
      height = `${attributes.height.toString()}px`
    }
  }
  const isLegendOnBottom = attributes.legendPosition === "bottom"

  const heightFromLocalStorage = attributes.heightId
    ? getHeightFromLocalStorage(attributes.heightId, isLegendOnBottom)
    : null

  if (heightFromLocalStorage) {
    // .replace() is for backwards compatibility -  old dashboard was always doing
    // JSON.stringify when setting localStorage so many users have '"180px"' values set.
    // We can remove .replace() after some time
    height = heightFromLocalStorage.replace(/"/g, "")
  }

  if (shouldAddSpecialHeight) {
    const heightOverriden = isLegendOnBottom
      ? window.innerHeight * 0.5
      : window.innerHeight * 0.4
    height = `${heightOverriden}px`
  }

  const chartDefaultsMinWidth = window.NETDATA.chartDefaults.min_width
  const minWidth = chartDefaultsMinWidth === null
    ? undefined
    : chartDefaultsMinWidth
  return {
    height,
    width,
    minWidth,
  }
}
