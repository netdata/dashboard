import { init, last, mergeAll } from "ramda"
import { createReducer } from "redux-act"

import { RegistryMachine } from "domains/global/sagas"
import { ActiveAlarms, Snapshot } from "domains/global/types"
import {
  requestCommonColorsAction,
  setGlobalChartUnderlayAction,
  setGlobalSelectionAction,
  setGlobalPanAndZoomAction,
  centerAroundHighlightAction,
  clearHighlightAction,
  setTimezoneAction,
  resetGlobalPanAndZoomAction,
  windowFocusChangeAction,
  fetchHelloAction,
  updatePersonUrlsAction,
  startAlarmsAction,
  updateActiveAlarmsAction,
  setOptionAction,
  loadSnapshotAction,
  setSpacePanelStatusAction,
} from "./actions"
import { Options, optionsMergedWithLocalStorage } from "./options"

export type StateT = {
  commonColorsKeys: {
    [key: string]: {
      // key can be uuid, chart's context or commonColors attribute
      assigned: {
        // name-value of dimensions and their colors
        [dimensionName: string]: string
      }
      available: string[] // an array of colors available to be used
      custom: string[] // the array of colors defined by the user
      charts: {} // the charts linked to this todo remove
      copyTheme: boolean
    }
  }
  currentSelectionMasterId: string | null
  globalPanAndZoom: null | {
    after: number
    before: number
    masterID?: string
    shouldForceTimeRange?: boolean
  }
  globalChartUnderlay: null | {
    after: number
    before: number
    masterID: string
  }
  timezone: string | undefined
  hoveredX: number | null
  hasWindowFocus: boolean

  spacePanelIsActive: boolean

  registry: {
    isCloudEnabled: boolean
    personGuid: string | null
    registryMachines: { [key: string]: RegistryMachine } | null
    registryMachinesArray: RegistryMachine[] | null
  }

  alarms: {
    activeAlarms: null | ActiveAlarms
    hasStarted: boolean
  }

  snapshot: Snapshot | null

  isFetchingHello: boolean

  options: Options
}

export const initialState = {
  commonColorsKeys: {},
  currentSelectionMasterId: null,
  globalPanAndZoom: null,
  globalChartUnderlay: null,
  timezone: window.NETDATA.options.current.timezone,
  hoveredX: null,
  hasWindowFocus: true,
  spacePanelIsActive: false, // set to true only for testing layout

  registry: {
    isCloudEnabled: false,
    personGuid: null,
    registryMachines: null,
    registryMachinesArray: null,
  },

  snapshot: null,
  alarms: {
    activeAlarms: null,
    hasStarted: false,
  },

  isFetchingHello: false,

  options: optionsMergedWithLocalStorage,
}

export const globalReducer = createReducer<StateT>({}, initialState)

export interface GetKeyArguments {
  colorsAttribute: string | undefined
  commonColorsAttribute: string | undefined
  chartUuid: string
  chartContext: string
}
export const getKeyForCommonColorsState = ({
  colorsAttribute,
  commonColorsAttribute,
  chartUuid,
  chartContext,
}: GetKeyArguments) => {
  const hasCustomColors = typeof colorsAttribute === "string" && colorsAttribute.length > 0

  // when there's commonColors attribute, share the state between all charts with that attribute
  // if not, when there are custom colors, make each chart independent
  // if not, share the same state between charts with the same context
  return commonColorsAttribute || (hasCustomColors ? chartUuid : chartContext)
}

const hasLastOnly = (array: string[]) => last(array) === "ONLY"
const removeLastOnly = (array: string[]) => (hasLastOnly(array) ? init(array) : array)
const createCommonColorsKeysSubstate = (
  colorsAttribute: string | undefined,
  hasCustomColors: boolean
) => {
  const custom = hasCustomColors ? removeLastOnly((colorsAttribute as string).split(" ")) : []
  const shouldCopyTheme = hasCustomColors
    ? // disable copyTheme when there's "ONLY" keyword in "data-colors" attribute
      !hasLastOnly((colorsAttribute as string).split(" "))
    : true
  const available = [
    ...custom,
    ...(shouldCopyTheme || custom.length === 0 ? window.NETDATA.themes.current.colors : []),
  ]
  return {
    assigned: {},
    available,
    custom,
  }
}

globalReducer.on(
  requestCommonColorsAction,
  (state, { chartContext, chartUuid, colorsAttribute, commonColorsAttribute, dimensionNames }) => {
    const keyName = getKeyForCommonColorsState({
      colorsAttribute,
      commonColorsAttribute,
      chartUuid,
      chartContext,
    })

    const hasCustomColors = typeof colorsAttribute === "string" && colorsAttribute.length > 0
    const subState =
      state.commonColorsKeys[keyName] ||
      createCommonColorsKeysSubstate(colorsAttribute, hasCustomColors)

    const currentlyAssignedNr = Object.keys(subState.assigned).length
    const requestedDimensionsAssigned = mergeAll(
      dimensionNames
        // dont assign already assigned dimensions
        .filter(dimensionName => !subState.assigned[dimensionName])
        .map((dimensionName, i) => ({
          [dimensionName]:
            subState.available[(i + currentlyAssignedNr) % subState.available.length],
        }))
    )
    const assigned = {
      ...subState.assigned,
      ...requestedDimensionsAssigned,
    }

    return {
      ...state,
      commonColorsKeys: {
        ...state.commonColorsKeys,
        [keyName]: {
          ...subState,
          assigned,
        },
      },
    }
  }
)

globalReducer.on(setTimezoneAction, (state, { timezone = "default" }) => ({
  ...state,
  timezone,
}))

globalReducer.on(setSpacePanelStatusAction, (state, { isActive }) => ({
  ...state,
  spacePanelIsActive: isActive,
}))

globalReducer.on(setGlobalSelectionAction, (state, { chartUuid, hoveredX }) => ({
  ...state,
  hoveredX,
  currentSelectionMasterId: chartUuid,
}))

globalReducer.on(
  setGlobalPanAndZoomAction,
  (state, { after, before, masterID, shouldForceTimeRange }) => ({
    ...state,
    globalPanAndZoom: {
      after,
      before,
      masterID,
      shouldForceTimeRange,
    },
  })
)

globalReducer.on(resetGlobalPanAndZoomAction, state => ({
  ...state,
  globalPanAndZoom: initialState.globalPanAndZoom,
  hoveredX: initialState.hoveredX, // need to reset this also on mobile
}))

globalReducer.on(setGlobalChartUnderlayAction, (state, { after, before, masterID }) => ({
  ...state,
  globalChartUnderlay: {
    after,
    before,
    masterID,
  },
}))

globalReducer.on(centerAroundHighlightAction, state => {
  if (!state.globalChartUnderlay) {
    // eslint-disable-next-line no-console
    console.warn("Cannot center around empty selection")
    return state
  }
  const { after, before } = state.globalChartUnderlay
  const highlightMargin = (before - after) / 2
  return {
    ...state,
    globalPanAndZoom: {
      after: after - highlightMargin,
      before: before + highlightMargin,
    },
  }
})

globalReducer.on(clearHighlightAction, state => ({
  ...state,
  globalChartUnderlay: initialState.globalChartUnderlay,
  globalPanAndZoom: initialState.globalPanAndZoom,
}))

globalReducer.on(windowFocusChangeAction, (state, { hasWindowFocus }) => ({
  ...state,
  hasWindowFocus,
}))

globalReducer.on(fetchHelloAction.request, state => ({
  ...state,
  isFetchingHello: true,
}))

globalReducer.on(fetchHelloAction.success, state => ({
  ...state,
  isFetchingHello: false,
}))

globalReducer.on(fetchHelloAction.failure, state => ({
  ...state,
  isFetchingHello: true,
}))

globalReducer.on(
  updatePersonUrlsAction,
  (state, { isCloudEnabled, personGuid, registryMachines, registryMachinesArray }) => ({
    ...state,
    registry: {
      ...state.registry,
      isCloudEnabled,
      personGuid,
      registryMachines,
      registryMachinesArray,
    },
  })
)

globalReducer.on(startAlarmsAction, state => ({
  ...state,
  alarms: {
    ...state.alarms,
    hasStarted: true,
  },
}))

globalReducer.on(updateActiveAlarmsAction, (state, { activeAlarms }) => ({
  ...state,
  alarms: {
    ...state.alarms,
    activeAlarms,
  },
}))

globalReducer.on(setOptionAction, (state, { key, value }) => ({
  ...state,
  options: {
    ...state.options,
    [key]: value,
  },
}))

globalReducer.on(loadSnapshotAction, (state, { snapshot }) => {
  const parsedData = Object.keys(snapshot.data)
    .map(dataKey => {
      let uncompressed
      try {
        // @ts-ignore
        uncompressed = snapshot.uncompress(snapshot.data[dataKey])

        // repeat old logging
        if (uncompressed === null) {
          // eslint-disable-next-line no-console
          console.warn(`uncompressed snapshot data for key ${dataKey} is null`)
          return null
        }

        if (typeof uncompressed === "undefined") {
          // eslint-disable-next-line no-console
          console.warn(`uncompressed snapshot data for key ${dataKey} is undefined`)
          return null
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`decompression of snapshot data for key ${dataKey} failed`, e)
        uncompressed = null
      }

      if (typeof uncompressed !== "string") {
        // eslint-disable-next-line no-console
        console.warn(`uncompressed snapshot data for key ${dataKey} is not string`)
        return {}
      }

      let data
      try {
        data = JSON.parse(uncompressed)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`parsing snapshot data for key ${dataKey} failed`)
        return {}
      }

      return { [dataKey]: data }
    })
    .reduce((acc, obj) => ({ ...acc, ...obj }), {})

  return {
    ...state,
    snapshot: {
      ...snapshot,
      data: parsedData as { [key: string]: unknown },
    },
  }
})
