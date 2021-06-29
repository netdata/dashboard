/* eslint-disable no-param-reassign */
// @ts-nocheck

export const defaultCellSize = 11
export const defaultPadding = 1
export const defaultAspectRatio = Math.round(16 / 9)

export const getCellBoxSize = (cellSize = defaultCellSize, padding = defaultPadding) =>
  cellSize - padding
export const getRows = (data, aspectRatio = defaultAspectRatio) =>
  Math.sqrt(data.length / aspectRatio)
export const getColumns = (rows, aspectRatio = defaultAspectRatio) => rows * aspectRatio

export const getXPosition = (columns, index, cellSize = defaultCellSize) =>
  Math.floor(index % columns) * cellSize
export const getYPosition = (columns, index, cellSize = defaultCellSize) =>
  Math.floor(index / columns) * cellSize

export const getFullWidth = (columns, cellSize = defaultCellSize) => Math.ceil(columns) * cellSize
export const getFullHeight = (rows, cellSize = defaultCellSize, padding = defaultCellSize) =>
  Math.ceil(rows) * cellSize + padding

export const getOffsetPosition = (offset, cellSize = defaultCellSize) =>
  Math.floor(offset / cellSize)
