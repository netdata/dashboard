/* eslint-disable no-param-reassign */
// @ts-nocheck

export const cellSize = 11
export const padding = 1
export const cellBoxSize = cellSize - padding

export const aspectRatio = Math.round(16 / 9)

export const getRows = (data) => Math.sqrt(data.length / aspectRatio)
export const getColumns = (rows) => rows * aspectRatio

export const getXPosition = (columns, index) => Math.floor(index % columns) * cellSize
export const getYPosition = (columns, index) => Math.floor(index / columns) * cellSize
