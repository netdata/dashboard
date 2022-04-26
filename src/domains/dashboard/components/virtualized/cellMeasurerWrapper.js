import React, { useRef, useEffect } from "react"
import { useList } from "domains/charts"

const deferred = callback => {
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
  const height = ref.current?.firstChild?.clientHeight

  useEffect(() => {
    let cancelDeferred

    const resize = () => {
      cancelDeferred = deferred(() => {
        if (
          !prevHeightRef.current ||
          (prevHeightRef.current && ref.current && Math.abs(prevHeightRef.current - height) > 10)
        ) {
          list.resize(id)
        }
        prevHeightRef.current = height
      })
    }

    resize()

    return cancelDeferred
  }, [id, height])

  return (
    <div ref={ref} style={{ ...style }}>
      {children}
    </div>
  )
}

export default Wrapper
