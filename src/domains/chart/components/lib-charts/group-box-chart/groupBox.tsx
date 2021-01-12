// @ts-nocheck
import React, { useRef, useLayoutEffect } from "react"
import { drawBoxes } from "./drawBoxes"

interface GroupboxData {
  data: number[]
  labels: string[]
}

interface GroupBoxProps {
  data: GroupboxData[]
}

const GroupBox = ({ data }: GroupBoxProps) => {
  const svgRef = useRef()
  const boxesRef = useRef()

  useLayoutEffect(() => {
    boxesRef.current = drawBoxes(svgRef.current)
    return () => boxesRef.current.clear()
  }, [])

  useLayoutEffect(() => {
    boxesRef.current.rerender(data)
  }, [data])

  return <svg ref={svgRef} />
}

export default GroupBox
