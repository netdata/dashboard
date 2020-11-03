import React, { useRef } from "react"
import { useToggle } from "react-use"

const useProceededChart = (firstEntry: number):
  [boolean, React.Ref<HTMLElement>, (g: Dygraph) => void] => {
  const [proceeded, toggleProceeded] = useToggle(false)

  const ref = useRef<HTMLElement>(null)

  const updatePosition = (g: Dygraph) => {
    const { x } = g.getArea()
    const distance = g.toDomXCoord(firstEntry * 1000)
    const hasProceeded = distance > x
    toggleProceeded(hasProceeded)

    if (hasProceeded && ref.current) {
      ref.current.style.left = `${x}px`
      ref.current.style.right = `calc(100% - ${distance}px)`
    }
  }

  return [proceeded, ref, updatePosition]
}

export default useProceededChart
