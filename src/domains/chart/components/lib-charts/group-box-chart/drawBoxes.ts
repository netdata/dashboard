// @ts-nocheck
import { scaleLog, extent, select } from "d3"

const cellSize = 13.5
const aspectRatio = Math.round(16 / 9)

const getRows = (data) => Math.sqrt(data.length / aspectRatio)
const getColumns = (rows) => rows * aspectRatio

const getXPosition = (numOfColumns) => {
  let col = 1
  return (_, index) => {
    if (col && !(index % numOfColumns)) col = 1
    else col += 1
    return col * cellSize - cellSize
  }
}

const getYPosition = (numOfColumns) => (_, index) => Math.floor(index / numOfColumns) * cellSize

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

const colorScale = (values) =>
  scaleLog()
    .domain(extent(values, (value) => value))
    .range(["#C6E3F6", "#0E9AFF"])

export default (el, { onMouseover, onMouseout }) => {
  const svg = select(el)

  const update = ({ data }) => {
    const { width, height, columns } = getCanvasAttributes(data)
    svg.attr("width", width)
    svg.attr("height", height)

    const updated = svg.selectAll("rect").data(data)
    const enter = updated
      .enter()
      .append("rect")
      .style("fill", (value) => colorScale(data)(value))

    updated
      .merge(enter)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("x", getXPosition(columns))
      .attr("y", getYPosition(columns))
      .attr("width", cellSize - 1.5)
      .attr("height", cellSize - 1.5)
      .style("opacity", 0.9)
      .style("fill", (value) => colorScale(data)(value))
      .on("mouseover", (value, index, boxes) => {
        select(boxes[index]).style("stroke", "#DCE2E8")
        onMouseover({
          value,
          index,
          target: boxes[index],
          boxes,
        })
      })
      .on("mouseout", (value, index, boxes) => {
        select(boxes[index]).style("stroke", "")
        onMouseout({
          value,
          index,
          target: boxes[index],
          boxes,
        })
      })

    updated.exit().remove()
  }

  const clear = () => svg.remove()

  return { clear, update }
}
