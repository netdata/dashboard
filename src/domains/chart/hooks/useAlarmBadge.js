import { useRef } from "react"
import { useToggle } from "react-use"

export default () => {
  const [isRendered, toggleIsRendered] = useToggle(false)

  const ref = useRef(null)

  const updatePosition = (alarm, g, position) => {
    if (!alarm) {
      toggleIsRendered(false)
      return
    }

    if (ref.current) {
      toggleIsRendered(true)
      const { x } = g.getArea()

      ref.current.style.left = `${x}px`
      ref.current.style.right = `calc(100% - ${position}px)`
      ref.current.style.top = "40px"
    }
  }

  return [isRendered, ref, updatePosition]
}
