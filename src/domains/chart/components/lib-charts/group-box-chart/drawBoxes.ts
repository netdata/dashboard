// @ts-nocheck
import { scaleLinear, extent } from "d3"

const cellSize = 13.5
const aspectRatio = Math.round(16 / 9)

const getRows = (data) => Math.sqrt(data.length / aspectRatio)
const getColumns = (rows) => rows * aspectRatio

const makeXPosition = (numOfColumns) => {
  let col = 1
  return (_, index) => {
    if (col && !(index % numOfColumns)) col = 1
    else col += 1
    return col * cellSize - cellSize
  }
}

const makeYPosition = (numOfColumns) => (_, index) => Math.floor(index / numOfColumns) * cellSize

export const getWidth = (data) => {
  const numOfRows = getRows(data)
  const numOfColumns = getColumns(numOfRows)
  return Math.ceil(numOfColumns) * cellSize
}

const getCanvasAttributes = (data) => {
  const numOfRows = getRows(data)
  const numOfColumns = getColumns(numOfRows)
  const width = Math.ceil(numOfColumns) * cellSize
  const height = Math.ceil(numOfRows) * cellSize + cellSize
  return { width, height, columns: Math.ceil(numOfColumns) }
}

const getCanvas = (el) => {
  const canvas = el
  const ctx = canvas.getContext("2d")

  const clearCanvas = (width, height) => {
    ctx.clearRect(0, 0, width, height)
    ctx.beginPath()
  }

  return {
    ctx,
    canvas,
    clearCanvas,
  }
}

const makeGetColor = (values) => scaleLinear()
  .domain(extent(values, (value) => value))
  .range(["rgba(198, 227, 246, 0.9)", "rgba(14, 154, 255, 0.9)"])


export default (el, { onMouseover, onMouseout }) => {
  const { ctx, canvas, clearCanvas } = getCanvas(el)

  const update = ({ data }) => {
    const { width, height, columns } = getCanvasAttributes(data)
    canvas.width = width
    canvas.height = height
    const getXPosition = makeXPosition(columns)
    const getYPosition = makeYPosition(columns)
    const getColor = makeGetColor(data)

    clearCanvas(width, height)
    data.forEach((value, index) => {
      ctx.fillStyle = getColor(value)
      ctx.fillRect(getXPosition(value, index), getYPosition(value, index), cellSize - 1.5, cellSize - 1.5)
    })
  }

  const clear = () => clearCanvas(canvas.width, canvas.height)

  return { clear, update }
}
