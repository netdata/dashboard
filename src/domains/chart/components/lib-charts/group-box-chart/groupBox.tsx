// @ts-nocheck
import React, { useRef, useLayoutEffect, Fragment, useState } from "react"
import { Drop, Flex } from "@netdata/netdata-ui"
import Container from "@netdata/netdata-ui/lib/components/drops/tooltip/container"
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
  const [, setDropHover] = useState(false)
  const [, setBoxHover] = useState(false)

  // const onMouseout = () => {
  //   requestAnimationFrame(() => {
  //     setDropHover((state) => {
  //       if (!state) setHover(null)
  //     })
  //   })
  // }

  useLayoutEffect(() => {
    boxesRef.current = drawBoxes(svgRef.current, {
      onMouseover: (props) => {
        setDropHover((state) => {
          if (state) {
            return
          }
          setBoxHover(true)
          setHover(props)
        })
      },
      onMouseout: () => {
        setBoxHover(false)
        requestAnimationFrame(() => {
          setDropHover((state) => {
            if (!state) {
              setHover(null)
            }
            return state
          })
        })
      },
    })
    return () => boxesRef.current.clear()
  }, [])

  useLayoutEffect(() => {
    boxesRef.current.update(data)
  }, [data])

  return (
    <Fragment>
      <svg ref={svgRef} />
      {renderTooltip && hover && (
        <Drop
          align={{ bottom: "top" }}
          target={hover.target}
          onMouseEnter={() => {
            setDropHover(true)
          }}
          onMouseLeave={() => {
            setDropHover(false)
            requestAnimationFrame(() => {
              setBoxHover((state) => {
                if (!state) {
                  setHover(null)
                }
                return state
              })
            })
          }}
        >
          {renderTooltip(hover)}
        </Drop>
      )}
    </Fragment>
  )
}

export default GroupBox
