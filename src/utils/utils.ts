import { equals } from "ramda"

// we use numbers to specify time. it can be either a timestamp (ms), or a relative value in seconds
// which is always 0 or less (0 is now, -300 is -5 minutes)

export const isTimestamp = (x: number) => x > 0

export const NETDATA_REGISTRY_SERVER = "https://registry.my-netdata.io"

export const MS_IN_SECOND = 1000
export const NODE_VIEW_DYGRAPH_TITLE_HEIGHT = 30
export const DEFAULT_DASHBOARD_DURATION = 5 * 60

export const getIframeSrc = (cloudBaseURL: string, path: string) => `${cloudBaseURL}/sso/v2/${path}`
export const utmUrlSuffix = "&utm_source=agent&utm_medium=web"

export const getInitialAfterFromWindow = () => {
  const div = document.getElementById("charts_div")
  if (!div) {
    // eslint-disable-next-line no-console
    console.error("Couldn't find '.charts_div' element to calculate width")
    return -900
  }
  // based on https://github.com/netdata/dashboard/blob/7a7b538b00f1c5a4e1550f69cb5333212bb68f95/src/main.js#L1753
  // eslint-disable-next-line max-len
  // var duration = Math.round(($(div).width() * pcent_width / 100 * data.update_every / 3) / 60) * 60;
  return -Math.round(div.getBoundingClientRect().width / 3 / 60) * 60
}

export const SPACE_PANEL_STATE = "space-panel-state"

export const useNewKeysOnlyIfDifferent = <T extends {}>(
  keys: (keyof T)[],
  obj1: T | null,
  obj2: T
): T => {
  if (!obj1) {
    return obj2
  }
  return keys.reduce<T>(
    (acc, key) => ({
      ...acc,
      [key]: equals(obj1[key], obj2![key]) ? obj1[key] : obj2[key],
    }),
    obj2
  )
}

export type AnyFunction<T = any> = (...args: T[]) => any

export type FunctionArguments<T extends Function> = T extends (...args: infer R) => any ? R : never

export function callAll<T extends AnyFunction>(...fns: (T | undefined)[]) {
  return function mergedFn(arg: FunctionArguments<T>[0]) {
    fns.forEach(fn => {
      fn?.(arg)
    })
  }
}
