// @ts-nocheck
import { scaleLog, extent, select } from "d3"

const numOfColumns = 32
const cellSize = 13.5

const getRows = (data) => Math.ceil(data.length / numOfColumns)

const getXPosition = () => {
  let col = 1
  return (_, index) => {
    if (col && !(index % numOfColumns)) col = 1
    else col += 1
    return col * cellSize - cellSize
  }
}

const getYPosition = (_, index) => Math.floor(index / numOfColumns) * cellSize

const getCanvasSize = (data) => {
  const numOfRows = getRows(data)
  const width = numOfRows === 1 ? data.length * cellSize : numOfColumns * cellSize
  const height = numOfRows * cellSize + cellSize
  return { width, height }
}

const colorScale = (values) =>
  scaleLog()
    .domain(extent(values, (value) => value))
    .range(["#C6E3F6", "#0E9AFF"])

export default (el, { onMouseover, onMouseout }) => {
  const svg = select(el)

  const update = ({ data }) => {
    const { width, height } = getCanvasSize(data)
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
      .attr("x", getXPosition())
      .attr("y", getYPosition)
      .attr("width", cellSize - 1.5)
      .attr("height", cellSize - 1.5)
      .style("opacity", 0.9)
      .style("fill", (value) => colorScale(data)(value))
      .on("mouseover", (value, index, boxes) => {
        onMouseover({ value, index, target: boxes[index], boxes })
      })
      .on("mouseout", (value, index, boxes) => {
        onMouseout({ value, index, target: boxes[index], boxes })
      })

    updated.exit().remove()
  }

  const clear = () => svg.remove()

  return { clear, update }
}
