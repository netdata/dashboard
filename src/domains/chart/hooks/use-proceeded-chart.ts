/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable function-paren-newline */
/* eslint-disable comma-dangle */
import React, { useRef, useCallback } from "react"
import { useToggle } from "react-use"

/* global Dygraph */

const useProceededChart = (
  chartRef: any,
  propsRef: any
): [boolean, React.Ref<HTMLElement>, (g: Dygraph) => void] => {
  const [proceeded, toggleProceeded] = useToggle(false)

  const ref = useRef<HTMLElement>(null)

  const updatePosition = useCallback((g: Dygraph) => {
    const { x } = g.getArea()
    const distance = g.toDomXCoord(propsRef.current.chartData.first_entry * 1000)
    const hasProceeded = distance > x
    toggleProceeded(hasProceeded)

    if (hasProceeded && ref.current) {
      const { height } = chartRef.current.getBoundingClientRect()
      ref.current.style.left = `${x}px`
      ref.current.style.right = `calc(100% - ${distance}px)`
      ref.current.style.top = `${height / 2}px`
    }
  }, [])

  return [proceeded, ref, updatePosition]
}

export default useProceededChart
