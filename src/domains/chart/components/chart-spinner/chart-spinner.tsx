import React from "react"

import * as S from "./styled"

// @ts-ignore
import chartLoadingSpinner from "./chart-loading-spinner-ver3.gif"

// temporary measure, to test spinner in form of a gif
const isGifSpinner = Boolean(localStorage.getItem("gif-spinner"))

interface Props {
  chartLibrary: string
}
export const ChartSpinner = ({
  chartLibrary,
}: Props) => {
  const margin = chartLibrary === "dygraph" ? 4 : 0
  if (isGifSpinner) {
    return (
      <S.GifSpinnerContainer className="GifSpinnerContainer" margin={margin}>
        <img src={chartLoadingSpinner} alt="spinner" />
      </S.GifSpinnerContainer>
    )
  }
  return (
    <S.ChartSpinner margin={margin} />
  )
}
