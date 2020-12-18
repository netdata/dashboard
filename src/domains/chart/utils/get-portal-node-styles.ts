import {
  LOCALSTORAGE_HEIGHT_KEY_PREFIX,
  LOCALSTORAGE_HEIGHT_KEY_PREFIX_OLD,
} from "domains/chart/components/resize-handler"

import { LEGEND_BOTTOM_SINGLE_LINE_HEIGHT } from "domains/chart/utils/legend-utils"
import { Attributes } from "./transformDataAttributes"
import { ChartLibraryConfig } from "./chartLibrariesSettings"

type GetPortalNodeStyles = (
  attributes: Attributes,
  chartSettings: ChartLibraryConfig,
) => {
  height: string | undefined,
  width: string | undefined,
  minWidth: string | undefined
}

const oldDefaultHeights = ["180px", "90px"]

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

  // We'll support the old key for few months, so that user's custom heights will be working,
  // but we'll save any changes only to the new key.
  const persistedHeightOld = localStorage.getItem(
    `${LOCALSTORAGE_HEIGHT_KEY_PREFIX_OLD}${heightID}`,
  )
  if (persistedHeightOld) {
    if (oldDefaultHeights.includes(persistedHeightOld)) {
      // If saved value looks like `oldDefaultHeights`, then it is most likely an automatic value
      // from old dashboard. Don't import it anymore. On next resize the height will be persisted
      // to the new key.
      return null
    }
    return persistedHeightOld
  }
  return null
}

export const getPortalNodeStyles: GetPortalNodeStyles = (
  attributes,
  chartSettings,
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
