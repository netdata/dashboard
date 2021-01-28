/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-fragments */
// @ts-nocheck
import React, { useRef, useLayoutEffect, Fragment, useState, useCallback } from "react"
import { Drop } from "@netdata/netdata-ui"
import drawBoxes from "./drawBoxes"
import getAlign from "./getAlign"

interface GroupboxData {
  data: number[]
  labels: string[]
}

interface GroupBoxProps {
  data: GroupboxData[]
}

const aligns = {
  top: { bottom: "top" },
  bottom: { top: "bottom" },
}

const GroupBox = ({ data, renderTooltip }: GroupBoxProps) => {
  const dataRef = useRef()
  const canvasRef = useRef()
  const boxesRef = useRef()

  const [hover, setHover] = useState(null)
  const dropHoverRef = useRef(false)
  const boxHoverRef = useRef(false)

  const close = () => {
    boxesRef.current.deactivateBox()
    setHover(null)
  }

  const closeDrop = () =>
    requestAnimationFrame(() => {
      if (!dropHoverRef.current && !boxHoverRef.current) close()
    })

  useLayoutEffect(() => {
    boxesRef.current = drawBoxes(canvasRef.current, {
      onMouseenter: ({ index, ...rect }) => {
        boxHoverRef.current = true
        setHover({
          target: { getBoundingClientRect: () => rect },
          index,
          rect,
        })
        boxesRef.current.activateBox(index)
      },
      onMouseout: () => {
        boxHoverRef.current = false
        closeDrop()
      },
    })
    return () => boxesRef.current.clear()
  }, [])

  useLayoutEffect(() => {
    if (
      hover &&
      dataRef.current &&
      dataRef.current.labels[hover.index] !== data.labels[hover.index]
    ) {
      close()
    }
    dataRef.current = data
    boxesRef.current.update(data)
  }, [data])

  const onMouseEnter = useCallback(() => {
    dropHoverRef.current = true
  }, [])

  const onMouseLeave = useCallback(() => {
    dropHoverRef.current = false
    closeDrop()
  }, [])

  const align = hover && getAlign(hover.target)

  return (
    <Fragment>
      <canvas ref={canvasRef} />
      {hover && renderTooltip && (
        <Drop
          align={aligns[align]}
          target={hover.target}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {renderTooltip(hover.index, align)}
        </Drop>
      )}
    </Fragment>
  )
}

export default GroupBox
