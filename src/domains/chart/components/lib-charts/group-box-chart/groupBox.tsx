/* eslint-disable react/jsx-fragments */
// @ts-nocheck
import React, {
  useRef, useLayoutEffect, Fragment, useState, useCallback,
} from "react"
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
  const canvasRef = useRef()
  const boxesRef = useRef()

  const [hover, setHover] = useState(null)
  const dropHoverRef = useRef(false)
  const boxHoverRef = useRef(false)

  const closeDrop = () => requestAnimationFrame(() => !dropHoverRef.current && !boxHoverRef.current && setHover(null))

  useLayoutEffect(() => {
    boxesRef.current = drawBoxes(canvasRef.current, {
      onMouseover: (props) => {
        boxHoverRef.current = true
        setHover(props)
      },
      onMouseout: () => {
        boxHoverRef.current = false
        closeDrop()
      },
    })
    return () => boxesRef.current.clear()
  }, [])

  useLayoutEffect(() => {
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
          {renderTooltip(hover, align)}
        </Drop>
      )}
    </Fragment>
  )
}

export default GroupBox
