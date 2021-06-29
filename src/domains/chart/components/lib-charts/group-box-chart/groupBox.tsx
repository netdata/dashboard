/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable object-curly-newline */
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

const GroupBox = ({ data, renderTooltip, aspectRatio }: GroupBoxProps) => {
  const dataRef = useRef()
  const canvasRef = useRef()
  const boxesRef = useRef()

  const [hover, setHover] = useState(null)
  const dropHoverRef = useRef(false)
  const boxHoverRef = useRef(-1)
  const timeoutId = useRef()

  const close = () => {
    boxesRef.current.deactivateBox()
    setHover(null)
    dropHoverRef.current = false
    boxHoverRef.current = -1
  }

  const closeDrop = () =>
    requestAnimationFrame(() => {
      setHover(currentHover => {
        if (
          !dropHoverRef.current &&
          (boxHoverRef.current === -1 || boxHoverRef.current !== currentHover?.index)
        ) {
          close()
        }
        return currentHover
      })
    })

  useLayoutEffect(() => {
    boxesRef.current = drawBoxes(canvasRef.current, {
      onMouseenter: ({ index, ...rect }) => {
        boxHoverRef.current = index
        boxesRef.current.activateBox(index)
        timeoutId.current = setTimeout(() => {
          setHover({
            target: { getBoundingClientRect: () => rect },
            index,
            rect,
          })
        }, 600)
      },
      onMouseout: () => {
        boxHoverRef.current = -1
        clearTimeout(timeoutId.current)
        closeDrop()
      },
      aspectRatio,
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
      <canvas data-testid="groupBox" ref={canvasRef} />
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
