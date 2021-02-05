import React, { useRef } from "react"
import { useToggle } from "react-use"

const elementWidth = 230 + 50 // 50 is twice the margin-right

const useProceededChart = (firstEntry: number):
  [boolean, React.Ref<HTMLElement>, (g: Dygraph) => void] => {
  const [proceeded, toggleProceeded] = useToggle(false)

  const ref = useRef<HTMLElement>(null)

  const updatePosition = (g: Dygraph) => {
    const { x, w } = g.getArea()
    const distance = g.toDomXCoord(firstEntry * 1000)
    const hasProceeded = distance > x
    toggleProceeded(hasProceeded)

    if (hasProceeded && ref.current) {
      // if user scrolls to the past too much, leave element in the middle
      const rightFixed = (w - elementWidth) / 2
      const rightGlued = w + x - distance

      const right = Math.max(rightFixed, rightGlued)
      ref.current.style.left = `${x}px`
      ref.current.style.right = `${right}px`
    }
  }

  return [proceeded, ref, updatePosition]
}

export default useProceededChart
