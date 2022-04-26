import { ChartData, ChartMetadata } from "../chart-types"
import { seconds4human } from "./seconds4human"

export const LEGEND_BOTTOM_SINGLE_LINE_HEIGHT = 80

export const legendPluginModuleString = (withContext: boolean, chartMetadata: ChartMetadata) => {
  let str = " "
  let context = ""

  if (withContext && typeof chartMetadata.context === "string") {
    // eslint-disable-next-line prefer-destructuring
    context = chartMetadata.context
  }

  if (typeof chartMetadata.plugin === "string" && chartMetadata.plugin !== "") {
    str = chartMetadata.plugin

    if (str.endsWith(".plugin")) {
      str = str.substring(0, str.length - 7)
    }

    if (typeof chartMetadata.module === "string" && chartMetadata.module !== "") {
      str += `:${chartMetadata.module}`
    }

    if (withContext && context !== "") {
      str += `, ${context}`
    }
  } else if (withContext && context !== "") {
    str = context
  }
  return str
}

export const legendResolutionTooltip = (chartData: ChartData, chartMetadata: ChartMetadata) => {
  const collected = chartMetadata.update_every
  // todo if there's no data (but maybe there won't be situation like this), then use "collected"
  const viewed = chartData.view_update_every
  if (collected === viewed) {
    return `resolution ${seconds4human(collected)}`
  }

  return `resolution ${seconds4human(viewed)}, collected every ${seconds4human(collected)}`
}

type GetNewSelectedDimensions = (arg: {
  allDimensions: string[],
  selectedDimensions: string[],
  clickedDimensionName: string,
  isModifierKeyPressed: boolean,
}) => string[]

export const getNewSelectedDimensions: GetNewSelectedDimensions = ({
  allDimensions,
  selectedDimensions,
  clickedDimensionName,
  isModifierKeyPressed,
}) => {
  // when selectedDimensions is empty, then all dimensions should be enabled
  // let's narrow this case now
  const enabledDimensions = selectedDimensions.length === 0 ? allDimensions : selectedDimensions
  const isCurrentlySelected = enabledDimensions.includes(clickedDimensionName)

  let newSelectedDimensions: string[]
  if (!isModifierKeyPressed
    && ((isCurrentlySelected && enabledDimensions.length > 1) || !isCurrentlySelected)
  ) {
    newSelectedDimensions = [clickedDimensionName]
  } else if (isCurrentlySelected) { // modifier key pressed
    newSelectedDimensions = enabledDimensions.filter(
      (dimension) => dimension !== clickedDimensionName,
    )
  } else { // modifier key pressed
    newSelectedDimensions = enabledDimensions.concat(clickedDimensionName)
  }

  if (newSelectedDimensions.length === allDimensions.length) {
    return []
  }
  return newSelectedDimensions
}
