/* eslint-disable object-curly-newline */
/* eslint-disable no-param-reassign */
// @ts-nocheck
import { getCellBoxSize, getXPosition, getYPosition, getOffsetPosition } from "./utilities"

export default (
  el,
  columns,
  total,
  { onMouseenter, onMouseout },
  { cellSize, cellPadding } = {}
) => {
  let hoveredIndex = -1

  const getEvent = index => {
    const rect = el.getBoundingClientRect()
    const offsetX = getXPosition(columns, index, cellSize)
    const offsetY = getYPosition(columns, index, cellSize)
    const left = rect.left + offsetX
    const top = rect.top + offsetY
    const cellBoxSize = getCellBoxSize(cellSize, cellPadding)

    return {
      index,
      left,
      top,
      right: left + cellBoxSize,
      bottom: top + cellBoxSize,
      width: cellBoxSize,
      height: cellBoxSize,
      offsetX,
      offsetY,
    }
  }

  const mouseout = () => {
    onMouseout(getEvent(hoveredIndex))
    hoveredIndex = -1
  }

  const mousemove = e => {
    const { offsetX, offsetY } = e
    const x = getOffsetPosition(offsetX, cellSize)
    const y = getOffsetPosition(offsetY, cellSize)
    const nextHoveredIndex = y * columns + x

    if (nextHoveredIndex === hoveredIndex) return

    if (hoveredIndex !== -1) mouseout()

    if (nextHoveredIndex >= total) return

    onMouseenter(getEvent(nextHoveredIndex))
    hoveredIndex = nextHoveredIndex
  }

  el.addEventListener("mousemove", mousemove)
  el.addEventListener("mouseout", mouseout)
  return () => {
    el.removeEventListener("mousemove", mousemove)
    el.removeEventListener("mouseout", mouseout)
  }
}
