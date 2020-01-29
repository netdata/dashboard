import {
  mergeAll, pipe, split, mergeRight,
} from "ramda"
import { mapIndexed } from "ramda-adjunct"

const defaultUrlOptions = {
  hash: "#",
  theme: null,
  help: null,
  mode: "live", // 'live', 'print'
  update_always: false,
  pan_and_zoom: false,
  server: null,
  after: 0,
  before: 0,
  highlight: false,
  highlight_after: 0,
  highlight_before: 0,
  nowelcome: false,
  show_alarms: false,
  chart: null,
  family: null,
  alarm: null,
  alarm_unique_id: 0,
  alarm_id: 0,
  alarm_event_id: 0,
  alarm_when: 0,
} as {[key: string]: unknown}

const isInvalidPair = ([key, value]: [string, string]) => (
  defaultUrlOptions[key] === undefined || value === undefined
)

const parseQueryPair = ([key, value]: [string, string]): {[key: string] : unknown} => {
  if (isInvalidPair([key, value])) {
    return {}
  }
  return {
    [key]: decodeURIComponent(value),
  }
}

export const parseUrl = pipe(
  split(";"),
  mapIndexed((value, index) => (
    (index === 0) ? { hash: value } : parseQueryPair((value.split("=") as [string, string]))
  )),
  mergeAll,
  mergeRight(defaultUrlOptions),
)

const urlParsed = parseUrl(document.location.hash)

export const isPrintMode = urlParsed.mode === "print"
