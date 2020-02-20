import {
  getAttributes,
} from "domains/chart/utils/transformDataAttributes"

export const parseChartString = (chartString: string) => {
  if (!chartString) {
    return null
  }
  // DOMParser will be removed when we'll adapt dashboard_info.js to DSL structure
  const node = new DOMParser().parseFromString(chartString, "text/html")
    .querySelector("[data-netdata]")

  if (node) {
    return getAttributes(node)
  }
  console.warn("unable to parse chart", chartString) // eslint-disable-line no-console
  return null
}
