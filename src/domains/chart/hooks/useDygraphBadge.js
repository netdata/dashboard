import { useRef } from "react"
import { useToggle } from "react-use"

const badgeTopMargin = "40px"

const defaultPositionTo = (ref, x, position, topMargin) => {
  ref.current.style.left = `${x}px`
  ref.current.style.right = `calc(100% - ${position}px)`
  ref.current.style.top = topMargin
}

export default () => {
  const [isRendered, toggleIsRendered] = useToggle(false)

  const ref = useRef(null)

  const updatePosition = (isVisible, g, position, positionTo = defaultPositionTo) => {
    if (!isVisible) {
      toggleIsRendered(false)
      return
    }

    if (ref.current) {
      toggleIsRendered(true)
      const { x } = g.getArea()

      positionTo(ref, x, position, badgeTopMargin)
    }
  }

  return [isRendered, ref, updatePosition]
}
