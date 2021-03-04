import { init, last, mergeAll } from "ramda"
import { createReducer } from "redux-act"

import { getInitialAfterFromWindow } from "utils/utils"
import { isMainJs } from "utils/env"
import { RegistryMachine } from "domains/global/sagas"
import { ActiveAlarms, Snapshot, ChartsMetadata } from "domains/global/types"
import { fetchInfoAction } from "domains/chart/actions"
import { InfoPayload } from "./__mocks__/info-mock"
import {
  requestCommonColorsAction,
  setGlobalChartUnderlayAction,
  setGlobalSelectionAction,
  setGlobalPanAndZoomAction,
  centerAroundHighlightAction,
  clearHighlightAction,
  resetGlobalPanAndZoomAction,
  setDefaultAfterAction,
  windowFocusChangeAction,
  fetchHelloAction,
  updatePersonUrlsAction,
  startAlarmsAction,
  updateActiveAlarmsAction,
  setOptionAction,
  loadSnapshotAction,
  chartsMetadataRequestSuccess,
  setCommonMaxAction,
  setCommonMinAction,
  resetOptionsAction,
  setSpacePanelStatusAction,
  setSpacePanelTransitionEndAction,
  resetRegistry,
  accessRegistrySuccessAction,
  resetDefaultAfterAction,
} from "./actions"
import {
  Options, optionsMergedWithLocalStorage, getOptionsMergedWithLocalStorage, clearLocalStorage,
} from "./options"
import { CLOUD_BASE_URL_DISABLED } from "./constants"

interface CommonMinMax {
  [commonKey: string]: {
    charts: {
      [chartUuid: string]: number
    }
    currentExtreme: number
  }
}

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
  commonMin: CommonMinMax
  commonMax: CommonMinMax
  currentSelectionMasterId: string | null
  globalPanAndZoom: null | {
    after: number // timestamp in ms
    before: number // timestamp in ms
    masterID?: string
    shouldForceTimeRange?: boolean
  }
  defaultAfter: number
  globalChartUnderlay: null | {
    after: number
    before: number
    masterID: string
  }
  hoveredX: number | null
  hasWindowFocus: boolean

  spacePanelIsActive: boolean
  spacePanelTransitionEndIsActive: boolean

  registry: {
    cloudBaseURL: string | null
    hasFetchedHello: boolean
    isHelloCallError: boolean | null
    hasFetchedInfo: boolean
    hostname: string
    isCloudEnabled: boolean | null
    isCloudAvailable: boolean | null
    isAgentClaimed: boolean | null
    isACLKAvailable: boolean | null
    hasStartedInfo: boolean
    fullInfoPayload: InfoPayload | null
    isFetchingHello: boolean
    machineGuid: string | null
    personGuid: string | null
    registryMachines: { [key: string]: RegistryMachine } | null
    registryMachinesArray: RegistryMachine[] | null
    registryServer: string | null,
  }

  chartsMetadata: {
    isFetching: boolean
    isFetchingError: boolean
    data: null | ChartsMetadata
  }

  alarms: {
    activeAlarms: null | ActiveAlarms
    hasStartedAlarms: boolean
  }

  snapshot: Snapshot | null
  options: Options
}

export const initialDefaultAfter = isMainJs ? getInitialAfterFromWindow() : -900

export const initialState: StateT = {
  commonColorsKeys: {},
  commonMin: {},
  commonMax: {},
  currentSelectionMasterId: null,
  globalPanAndZoom: null,
  // todo for dashboard calculate it based on width and window.NETDATA.chartDefaults.after
  defaultAfter: initialDefaultAfter,
  globalChartUnderlay: null,
  hoveredX: null,
  hasWindowFocus: document.hasFocus(),
  spacePanelIsActive: false, // set to true only for testing layout
  // the same as property above, just updated after transition ends
  spacePanelTransitionEndIsActive: false,

  registry: {
    cloudBaseURL: null,
    hasFetchedInfo: false,
    hasFetchedHello: false,
    isHelloCallError: null,
    hostname: "unknown",
    isCloudEnabled: null,
    isCloudAvailable: null,
    isAgentClaimed: null,
    isACLKAvailable: null,
    hasStartedInfo: false,
    isFetchingHello: false,
    fullInfoPayload: null,
    machineGuid: null,
    personGuid: null,
    registryMachines: null,
    registryMachinesArray: null,
    registryServer: null,
  },

  snapshot: null,
  alarms: {
    activeAlarms: null,
    hasStartedAlarms: false,
  },

  chartsMetadata: {
    isFetching: false,
    isFetchingError: false,
    data: null,
  },

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
  hasCustomColors: boolean,
) => {
  const custom = hasCustomColors ? removeLastOnly((colorsAttribute as string).split(" ")) : []
  const shouldCopyTheme = hasCustomColors
    // disable copyTheme when there's "ONLY" keyword in "data-colors" attribute
    ? !hasLastOnly((colorsAttribute as string).split(" "))
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
  //@ts-ignore
  (state, {
    chartContext, chartUuid, colorsAttribute, commonColorsAttribute, dimensionNames,
  }) => {
    const keyName = getKeyForCommonColorsState({
      colorsAttribute,
      commonColorsAttribute,
      chartUuid,
      chartContext,
    })

    const hasCustomColors = typeof colorsAttribute === "string" && colorsAttribute.length > 0
    const subState = state.commonColorsKeys[keyName]
      || createCommonColorsKeysSubstate(colorsAttribute, hasCustomColors)

    const currentlyAssignedNr = Object.keys(subState.assigned).length
    const requestedDimensionsAssigned = mergeAll(
      dimensionNames
        // dont assign already assigned dimensions
        .filter((dimensionName) => !subState.assigned[dimensionName])
        .map((dimensionName, i) => ({
          [dimensionName]:
            subState.available[(i + currentlyAssignedNr) % subState.available.length],
        })),
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
  },
)


globalReducer.on(setCommonMinAction, (state, { chartUuid, commonMinKey, value }) => {
  const charts = {
    ...state.commonMin[commonMinKey]?.charts,
    [chartUuid]: value,
  }
  const currentExtreme = Math.min(...Object.values(charts))

  return {
    ...state,
    commonMin: {
      ...state.commonMin,
      [commonMinKey]: {
        charts,
        currentExtreme,
      },
    },
  }
})

globalReducer.on(setCommonMaxAction, (state, { chartUuid, commonMaxKey, value }) => {
  const charts = {
    ...state.commonMax[commonMaxKey]?.charts,
    [chartUuid]: value,
  }
  const currentExtreme = Math.max(...Object.values(charts))

  return {
    ...state,
    commonMax: {
      ...state.commonMax,
      [commonMaxKey]: {
        charts,
        currentExtreme,
      },
    },
  }
})

globalReducer.on(setSpacePanelStatusAction, (state, { isActive }) => ({
  ...state,
  spacePanelIsActive: isActive,
}))

globalReducer.on(setSpacePanelTransitionEndAction, (state, { isActive }) => ({
  ...state,
  spacePanelTransitionEndIsActive: isActive,
}))

globalReducer.on(setGlobalSelectionAction, (state, { chartUuid, hoveredX }) => ({
  ...state,
  hoveredX,
  currentSelectionMasterId: chartUuid,
}))

globalReducer.on(
  setGlobalPanAndZoomAction,
  (state, payload) => ({
    ...state,
    globalPanAndZoom: payload,
  }),
)

globalReducer.on(resetGlobalPanAndZoomAction, (state) => ({
  ...state,
  globalPanAndZoom: initialState.globalPanAndZoom,
  hoveredX: initialState.hoveredX, // need to reset this also on mobile
}))

globalReducer.on(setDefaultAfterAction, (state, { after }) => ({
  ...state,
  defaultAfter: after,
}))

globalReducer.on(resetDefaultAfterAction, (state) => ({
  ...state,
  defaultAfter: initialState.defaultAfter,
}))

globalReducer.on(setGlobalChartUnderlayAction, (state, { after, before, masterID }) => ({
  ...state,
  globalChartUnderlay: {
    after,
    before,
    masterID,
  },
}))

globalReducer.on(centerAroundHighlightAction, (state) => {
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

globalReducer.on(clearHighlightAction, (state) => ({
  ...state,
  globalChartUnderlay: initialState.globalChartUnderlay,
  globalPanAndZoom: initialState.globalPanAndZoom,
}))

globalReducer.on(windowFocusChangeAction, (state, { hasWindowFocus }) => {
  // make additional check, because it's possible to get hasWindowFocus === false
  // message from iframe, after main window makes the state change (race condition)
  const hasFocusNow = document.hasFocus()
  return {
    ...state,
    hasWindowFocus: hasFocusNow || hasWindowFocus,
  }
})

globalReducer.on(fetchHelloAction.request, (state) => ({
  ...state,
  registry: {
    ...state.registry,
    isFetchingHello: true,
  },
}))

globalReducer.on(fetchHelloAction.success, (state, {
  cloudBaseURL, hostname, machineGuid,
}) => ({
  ...state,
  registry: {
    ...state.registry,
    cloudBaseURL,
    isFetchingHello: false,
    hasFetchedHello: true,
    hostname,
    machineGuid,
  },
}))
globalReducer.on(fetchHelloAction.failure, (state) => ({
  ...state,
  registry: {
    ...state.registry,
    cloudBaseURL: CLOUD_BASE_URL_DISABLED,
    isFetchingHello: false,
    isHelloCallError: true,
  },
}))
globalReducer.on(accessRegistrySuccessAction, (state, { registryServer }) => ({
  ...state,
  registry: {
    ...state.registry,
    registryServer,
  },
}))

globalReducer.on(resetRegistry, (state) => ({
  ...state,
  registry: {
    ...state.registry,
    hasFetchedHello: initialState.registry.hasFetchedHello,
  },
}))

globalReducer.on(fetchInfoAction, (state) => ({
  ...state,
  registry: {
    ...state.registry,
    hasStartedInfo: true,
  },
}))
globalReducer.on(fetchInfoAction.success, (state, {
  isCloudAvailable, isCloudEnabled, isAgentClaimed, isACLKAvailable, fullInfoPayload,
}) => ({
  ...state,
  registry: {
    ...state.registry,
    hasFetchedInfo: true,
    isCloudAvailable,
    isCloudEnabled,
    isAgentClaimed,
    isACLKAvailable,
    fullInfoPayload,
  },
}))

globalReducer.on(fetchInfoAction.failure, (state) => ({
  ...state,
  registry: {
    ...state.registry,
    isCloudAvailable: false,
    isCloudEnabled: false,
    isAgentClaimed: false,
    isACLKAvailable: false,
  },
}))

globalReducer.on(updatePersonUrlsAction, (state, {
  personGuid, registryMachines, registryMachinesArray,
}) => ({
  ...state,
  registry: {
    ...state.registry,
    personGuid,
    registryMachines,
    registryMachinesArray,
  },
}))

globalReducer.on(startAlarmsAction, (state) => ({
  ...state,
  alarms: {
    ...state.alarms,
    hasStartedAlarms: true,
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

globalReducer.on(resetOptionsAction, (state) => {
  clearLocalStorage()
  return {
    ...state,
    options: getOptionsMergedWithLocalStorage(),
  }
})

globalReducer.on(loadSnapshotAction, (state, { snapshot }) => {
  const parsedData = Object.keys(snapshot.data)
    .map((dataKey) => {
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


globalReducer.on(chartsMetadataRequestSuccess, (state, { data }) => ({
  ...state,
  chartsMetadata: {
    ...state.chartsMetadata,
    data,
  },
}))
