/* eslint-disable no-param-reassign */
// @ts-nocheck
import { scaleLinear, extent } from "d3"
import { cellSize, cellBoxSize, getRows, getColumns, getXPosition, getYPosition } from "./utilities"
import registerEvents from "./events"

export const getWidth = (data) => {
  const rows = getRows(data)
  const columns = getColumns(rows)
  return Math.ceil(columns) * cellSize
}

const getCanvasAttributes = (data) => {
  const rows = getRows(data)
  const columns = getColumns(rows)
  const width = Math.ceil(columns) * cellSize
  const height = Math.ceil(rows) * cellSize + cellSize
  return { width, height, columns: Math.ceil(columns) }
}

const makeGetColor = (values) =>
  scaleLinear()
    .domain(extent(values, (value) => value))
    .range(["rgba(198, 227, 246, 0.9)", "rgba(14, 154, 255, 0.9)"])

export default (el, { onMouseenter, onMouseout }) => {
  const canvas = el.getContext("2d")

  let activeBox = -1
  let deactivateBox = () => {}
  let activateBox = {}
  let clearEvents = () => {}

  const clear = () => {
    deactivateBox()
    clearEvents()
    canvas.clearRect(0, 0, el.width, el.height)
    canvas.beginPath()
  }

  const update = ({ data }) => {
    const { width, height, columns } = getCanvasAttributes(data)
    el.width = width
    el.height = height
    clear()
    clearEvents()
    const getColor = makeGetColor(data)

    const drawBox = (value, index) => {
      canvas.fillStyle = getColor(value)
      canvas.fillRect(
        getXPosition(columns, index),
        getYPosition(columns, index),
        cellBoxSize,
        cellBoxSize
      )
    }

    data.forEach(drawBox)

    clearEvents = registerEvents(el, columns, data.length, { onMouseenter, onMouseout })

    deactivateBox = () => {
      if (activeBox !== -1) drawBox(data[activeBox], activeBox)
    }

    activateBox = (index) => {
      deactivateBox()
      activeBox = index

      const offsetX = getXPosition(columns, index)
      const offsetY = getYPosition(columns, index)

      canvas.lineWidth = 1
      canvas.strokeStyle = "#fff"
      canvas.strokeRect(offsetX + 1, offsetY + 1, cellBoxSize - 2, cellBoxSize - 2)
    }
  }

  return {
    clear,
    update,
    activateBox: (index) => activateBox(index),
    deactivateBox: () => deactivateBox(),
  }
}
