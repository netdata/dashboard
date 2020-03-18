import { mergeAll, mergeRight } from "ramda"
import { LOCALSTORAGE_HEIGHT_KEY_PREFIX } from "domains/chart/components/resize-handler"

export const SYNC_PAN_AND_ZOOM = "sync_pan_and_zoom"

/* eslint-disable camelcase */

export interface Options {
  // performance options
  stop_updates_when_focus_is_lost: boolean
  eliminate_zero_dimensions: boolean
  destroy_on_hide: boolean
  async_on_scroll: boolean

  // synchronization options
  parallel_refresher: boolean
  concurrent_refreshes: boolean
  sync_selection: boolean
  [SYNC_PAN_AND_ZOOM]: boolean

  // visual options
  theme: string
  show_help: boolean
  pan_and_zoom_data_padding: boolean
  smooth_plot: boolean

  // locale options
  units: "auto" | "original"
  temperature: "celsius" | "fahrenheit"
  seconds_as_time: boolean
  timezone: string
  user_set_server_timezone: string
}
export type OptionsKey = keyof Options

// those options have been created around 2015/2016 and some of them are not needed anymore
// so we need to revisit them, test their impact, etc.

export const INITIAL_OPTIONS: Options = {
  // performance options

  // boolean - shall we stop auto-refreshes when document does not have user focus
  stop_updates_when_focus_is_lost: true,
  // do not show dimensions with just zeros
  eliminate_zero_dimensions: true,
  // destroy charts when they are not visible
  destroy_on_hide: false, // eventually apply slow device detection
  async_on_scroll: false,

  // synchronization options
  // enable parallel refresh of charts
  parallel_refresher: true, // eventually apply slow device detection
  // when parallel_refresher is enabled, sync also the charts
  concurrent_refreshes: true,
  // enable or disable selection sync
  sync_selection: true,
  // enable or disable pan and zoom sync
  [SYNC_PAN_AND_ZOOM]: true,

  // visual options
  theme: "slate",
  // when enabled the charts will show some help
  // when there's no bootstrap, we can't show it
  show_help: Boolean(window.netdataShowHelp) && !window.netdataNoBootstrap,
  // fetch more data for the master chart when panning or zooming
  pan_and_zoom_data_padding: true,
  // enable smooth plot, where possible
  smooth_plot: true, // eventually apply slow device detection

  // locale options
  units: "auto", // auto or original
  temperature: "celsius",
  seconds_as_time: true, // show seconds as DDd:HH:MM:SS ?
  timezone: "default", // the timezone to use, or 'default'
  user_set_server_timezone: "default", // as set by the user on the dashboard
}

const removeOptionsPrefix = <T extends string>(key: T) => key.replace(/^options\./, "")

const getItemFromLocalStorage = <T extends string>(key: T) => {
  const value = localStorage.getItem(key)
  // "undefined" (deliberate as a string) to support "options.setOptionCallback", an old property
  // used in old dashboard. users will still have it, so we need to support it for some time
  if (value === null || value === "undefined") {
    localStorage.removeItem(key)
    return null
  }
  let parsed
  try {
    parsed = JSON.parse(value)
  } catch (e) {
    console.log(`localStorage: failed to read "${key}", using default`) // eslint-disable-line no-console, max-len
    // it was not present in old dashboard, but it probably makes sense to remove broken values
    localStorage.removeItem(key)
    return null
  }
  return parsed
}

export const getOptionsMergedWithLocalStorage = (): Options => {
  const optionsFromLocalStorage = Object.keys(localStorage)
    .filter((key) => key.startsWith("options."))
    .map((key) => ({
      [removeOptionsPrefix(key)]: getItemFromLocalStorage(key),
    }))
    .filter((o) => Object.values(o)[0] !== null)

  const overridenOptions = mergeAll(optionsFromLocalStorage) as unknown as Options
  return mergeRight(INITIAL_OPTIONS, overridenOptions)
}

export const optionsMergedWithLocalStorage = getOptionsMergedWithLocalStorage()

export const clearLocalStorage = () => {
  const localStorageKeys = Object.keys(localStorage)
  localStorageKeys.forEach((key) => {
    if (key.startsWith(LOCALSTORAGE_HEIGHT_KEY_PREFIX) || key.startsWith("options.")) {
      localStorage.removeItem(key)
    }
  })
}
