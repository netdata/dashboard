// @ts-nocheck
import React, { useRef, useLayoutEffect, Fragment, useState, useCallback } from "react"
import { Drop } from "@netdata/netdata-ui"
import drawBoxes from "./drawBoxes"

interface GroupboxData {
  data: number[]
  labels: string[]
}

interface GroupBoxProps {
  data: GroupboxData[]
}

const GroupBox = ({ data, renderTooltip }: GroupBoxProps) => {
  const svgRef = useRef()
  const boxesRef = useRef()

  const [hover, setHover] = useState(null)
  const dropHoverRef = useRef(false)
  const boxHoverRef = useRef(false)

  const closeDrop = () =>
    requestAnimationFrame(() => !dropHoverRef.current && !boxHoverRef.current && setHover(null))

  useLayoutEffect(() => {
    boxesRef.current = drawBoxes(svgRef.current, {
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

  return (
    <Fragment>
      <svg ref={svgRef} />
      {renderTooltip && hover && (
        <Drop
          align={{ bottom: "top" }}
          target={hover.target}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {renderTooltip(hover)}
        </Drop>
      )}
    </Fragment>
  )
}

export default GroupBox
