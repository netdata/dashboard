import React, { useState, useCallback, useEffect } from "react"
import { ToolboxButton } from "domains/chart/components/toolbox-button"
import { setResizeHeightAction } from "domains/chart/actions"
import { LEGEND_BOTTOM_SINGLE_LINE_HEIGHT } from "domains/chart/utils/legend-utils"
import { useDispatch } from "store/redux-separate-context"

export const LOCALSTORAGE_HEIGHT_KEY_PREFIX_OLD = "chart_heights."
export const LOCALSTORAGE_HEIGHT_KEY_PREFIX = "chart_height."

interface Props {
  chartContainerElement: HTMLElement
  chartUuid: string
  heightId: string | undefined
  isLegendOnBottom: boolean
}

export const ResizeHandler = ({
  chartContainerElement, chartUuid, heightId, isLegendOnBottom,
}: Props) => {
  const [resizeHeight, setResizeHeight] = useState(() => chartContainerElement.clientHeight)
  const dispatch = useDispatch()

  useEffect(() => {
    // todo when attributes.id are present, hook height to localStorage
    if (resizeHeight >= 70) {
      dispatch(
        setResizeHeightAction({
          id: chartUuid,
          resizeHeight,
        }),
      )
    }
  }, [resizeHeight, chartUuid, heightId, dispatch])

  const handleResize = useCallback(
    (event) => {
      event.preventDefault()
      const intialHeight = chartContainerElement.clientHeight
      const eventStartHeight = event.type === "touchstart"
        ? event.touches[0].clientY
        : event.clientY

      const setHeight = (currentHeight: number) => {
        const nextHeight = intialHeight + currentHeight - eventStartHeight
        // eslint-disable-next-line no-param-reassign
        chartContainerElement.style.height = `${nextHeight.toString()}px`
        setResizeHeight(nextHeight)
        if (heightId) {
          const heightForPersistance = isLegendOnBottom
            ? (nextHeight - LEGEND_BOTTOM_SINGLE_LINE_HEIGHT)
            : nextHeight
          localStorage.setItem(
            `${LOCALSTORAGE_HEIGHT_KEY_PREFIX}${heightId}`,
            `${heightForPersistance}`,
          )
        }
      }

      const onMouseMove = (e: MouseEvent) => setHeight(e.clientY)
      const onTouchMove = (e: TouchEvent) => setHeight(e.touches[0].clientY)

      const onMouseEnd = () => {
        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("mouseup", onMouseEnd)
      }

      const onTouchEnd = () => {
        document.removeEventListener("touchmove", onTouchMove)
        document.removeEventListener("touchend", onTouchEnd)
      }

      if (event.type === "touchstart") {
        document.addEventListener("touchmove", onTouchMove)
        document.addEventListener("touchend", onTouchEnd)
      } else {
        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onMouseEnd)
      }
    },
    [chartContainerElement.clientHeight, chartContainerElement.style.height, heightId,
      isLegendOnBottom],
  )

  return (
    <ToolboxButton
      className="netdata-legend-resize-handler"
      onDoubleClick={(event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
      }}
      onMouseDown={handleResize}
      onTouchStart={handleResize}
      iconType="resize"
      popoverTitle="Chart Resize"
      popoverContent="Drag this point with your mouse or your finger (on touch devices), to resize
     the chart vertically. You can also <b>double click it</b> or <b>double tap it</b> to reset
      between 2 states: the default and the one that fits all the values.<br/><small>Help
       can be disabled from the settings.</small>"
    />
  )
}
