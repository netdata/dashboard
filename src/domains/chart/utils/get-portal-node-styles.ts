import { LOCALSTORAGE_HEIGHT_KEY_PREFIX } from "domains/chart/components/resize-handler"

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

  const heightFromLocalStorage = attributes.heightId
    ? localStorage.getItem(`${LOCALSTORAGE_HEIGHT_KEY_PREFIX}${attributes.heightId}`)
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
