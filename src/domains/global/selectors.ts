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

export const selectTimezone = createSelector(
  selectGlobal,
  (subState) => subState.timezone,
)

export const selectGlobalSelection = createSelector(
  selectGlobal,
  prop("hoveredX"),
)

export const selectGlobalSelectionMaster = createSelector(
  selectGlobal,
  prop("currentSelectionMasterId"),
)

export const selectGlobalPanAndZoom = createSelector(
  selectGlobal,
  prop("globalPanAndZoom"),
)

export const selectGlobalChartUnderlay = createSelector(
  selectGlobal,
  prop("globalChartUnderlay"),
)

export const selectHasWindowFocus = createSelector(
  selectGlobal,
  prop("hasWindowFocus"),
)

export const selectIsFetchingHello = createSelector(
  selectGlobal,
  prop("isFetchingHello"),
)

export const selectHasStartedAlarms = createSelector(
  selectGlobal,
  path(["alarms", "hasStartedAlarms"]),
)

export const selectOptions = createSelector(
  selectGlobal,
  (global) => global.options,
)

export const createSelectOption = <T extends OptionsKey>(optionName: T) => createSelector(
  selectOptions,
  (options) => options[optionName],
)

export const selectDestroyOnHide = createSelectOption("destroy_on_hide")
