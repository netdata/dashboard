import React, { useRef, useEffect } from "react"
import { useList } from "domains/charts"

const deffered = callback => {
  if (window.requestIdleCallback) {
    const id = requestIdleCallback(callback)
    return () => cancelIdleCallback(id)
  }

  const id = requestAnimationFrame(callback)
  return () => cancelAnimationFrame(id)
}

const Wrapper = ({ children, style, id }) => {
  const list = useList()
  const ref = useRef()

  useEffect(() => {
    const animationId = requestAnimationFrame(() => list.measure(id))
    return () => cancelAnimationFrame(animationId)
  }, [id])

  const prevHeightRef = useRef()
  useEffect(() => {
    let timeoutId
    let cancelDeffered

    const resize = () => {
      timeoutId = setTimeout(() => {
        cancelDeffered = deffered(() => {
          if (
            !prevHeightRef.current ||
            (prevHeightRef.current &&
              ref.current &&
              Math.abs(prevHeightRef.current - ref.current.firstChild.clientHeight) > 10)
          ) {
            list.resize(id)
          }
          prevHeightRef.current = ref.current?.firstChild.clientHeight
          resize()
        })
      }, 400)
    }

    resize()

    return () => {
      cancelDeffered?.()
      clearTimeout(timeoutId)
    }
  }, [id])

  return <div ref={ref}>{children}</div>
}

export default Wrapper
