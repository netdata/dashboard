import React from "react"

import * as S from "./styled"

interface Props {
  chartLibrary: string
}
export const ChartSpinner = ({
  chartLibrary,
}: Props) => {
  const top = chartLibrary === "dygraph" ? 35 : 0
  const right = chartLibrary === "dygraph" ? 10 : 0
  const size = chartLibrary === "dygraph" ? 10 : 7
  const spaceBetween = chartLibrary === "dygraph" ? 4 : 2
  return (
    <S.SpinnerContainer top={top} right={right}>
      <S.Circle size={size} />
      <S.Circle2 size={size} spaceBetween={spaceBetween} />
      <S.Circle3 size={size} spaceBetween={spaceBetween} />
    </S.SpinnerContainer>
  )
}
