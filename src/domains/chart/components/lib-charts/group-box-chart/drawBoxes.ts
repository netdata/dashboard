// @ts-nocheck
import { scaleLog, extent, select } from "d3"

export const numOfColumns = 32
export const cellSize = 13.5

export const getRows = (data) => Math.ceil(data.length / numOfColumns)

export const getXPosition = () => {
  let col = 1
  return (_, index) => {
    if (col && !(index % numOfColumns)) col = 1
    else col += 1
    return col * cellSize - cellSize
  }
}

export const getYPosition = (_, index) => Math.floor(index / numOfColumns) * cellSize

export const getCanvasSize = (data) => {
  const numOfRows = getRows(data)
  const width = numOfRows === 1 ? data.length * cellSize : numOfColumns * cellSize
  const height = numOfRows * cellSize + cellSize
  return { width, height }
}

export const colorScale = (values) => scaleLog()
  .domain(extent(values, (value) => value))
  .range(["#C6E3F6", "#0E9AFF"])

export const drawBoxes = (el) => {
  const svg = select(el)

  const rerender = ({ data }) => {
    const { width, height } = getCanvasSize(data)
    svg.attr("width", width)
    svg.attr("height", height)

    const update = svg.selectAll("rect").data(data)
    const enter = update
      .enter()
      .append("rect")
      .style("fill", (value) => colorScale(data)(value))
    update
      .merge(enter)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("x", getXPosition())
      .attr("y", getYPosition)
      .attr("width", cellSize - 1.5)
      .attr("height", cellSize - 1.5)
      .style("opacity", 0.9)
      .transition()
      .duration(1000)
      .style("fill", (value) => colorScale(data)(value))

    update.exit().remove()
  }

  const clear = () => svg.remove()

  return {
    clear,
    rerender,
  }
}
