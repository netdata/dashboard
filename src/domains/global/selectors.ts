import { prop, path } from "ramda"
import { createSelector } from "reselect"

import { AppStateT } from "store/app-state"

import { GetKeyArguments, getKeyForCommonColorsState } from "./reducer"
import { storeKey } from "./constants"
import { OptionsKey } from "./options"

export const createSelectAssignedColors = (args: GetKeyArguments) => (state: AppStateT) => {
  const keyName = getKeyForCommonColorsState(args)
  const substate = state[storeKey].commonColorsKeys[keyName]
  return substate && substate.assigned
}

export const selectGlobal = (state: AppStateT) => state.global

export const selectTimezone = createSelector(selectGlobal, subState => subState.timezone)

export const selectGlobalSelection = createSelector(selectGlobal, prop("hoveredX"))

export const selectGlobalSelectionMaster = createSelector(
  selectGlobal,
  prop("currentSelectionMasterId")
)

export const selectGlobalPanAndZoom = createSelector(selectGlobal, prop("globalPanAndZoom"))

export const selectGlobalChartUnderlay = createSelector(selectGlobal, prop("globalChartUnderlay"))

export const selectHasWindowFocus = createSelector(selectGlobal, prop("hasWindowFocus"))

export const selectIsFetchingHello = createSelector(selectGlobal, prop("isFetchingHello"))

export const selectSnapshot = createSelector(selectGlobal, prop("snapshot"))

export const selectHasStartedAlarms = createSelector(
  selectGlobal,
  path(["alarms", "hasStartedAlarms"])
)
export const selectActiveAlarms = createSelector(
  selectGlobal,
  (global) => global.alarms.activeAlarms,
)

export const selectSpacePanelIsActive = createSelector(selectGlobal, path(["spacePanelIsActive"]))

export const selectOptions = createSelector(selectGlobal, global => global.options)

export const createSelectOption = <T extends OptionsKey>(optionName: T) =>
  createSelector(selectOptions, options => options[optionName])

export const selectDestroyOnHide = createSelectOption("destroy_on_hide")
export const selectStopUpdatesWhenFocusIsLost = createSelectOption(
  "stop_updates_when_focus_is_lost"
)
export const selectShouldEliminateZeroDimensions = createSelectOption("eliminate_zero_dimensions")
export const selectIsAsyncOnScroll = createSelectOption("async_on_scroll")

export const selectParallelRefresher = createSelectOption("parallel_refresher")
export const selectConcurrentRefreshes = createSelectOption("concurrent_refreshes")
export const selectSyncSelection = createSelectOption("sync_selection")
export const selectSyncPanAndZoom = createSelectOption("sync_pan_and_zoom")

export const selectTheme = createSelectOption("theme")
export const selectShowHelp = createSelectOption("show_help")
export const selectPanAndZoomDataPadding = createSelectOption("pan_and_zoom_data_padding")
export const selectSmoothPlot = createSelectOption("smooth_plot")

export const selectUnitsScalingMethod = createSelectOption("units")
export const selectTemperatureSetting = createSelectOption("temperature")
export const selectSecondsAsTimeSetting = createSelectOption("seconds_as_time")
export const selectTimezoneSetting = createSelectOption("timezone")
export const selectUserSetServerTimezone = createSelectOption("user_set_server_timezone")
