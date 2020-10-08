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
  const size = chartLibrary === "dygraph" ? 36 : 18
  return (
    <S.GifSpinnerContainer size={size} top={top} right={right}>
      <svg
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        viewBox="0 0 20 20"
        transform="translate(0,0)"
      >
        <g transform="translate(10,9) translate(-8,-9)">
          <S.SvgCircle
            // eslint-disable-next-line max-len
            d="M16.312,5.103L17.137,4.278C17.528,3.887,17.528,3.255,17.137,2.864C16.746,2.473,16.114,2.473,15.723,2.864L14.898,3.689C13.792,2.829,12.458,2.253,11,2.07L11,2C11.553,2,12,1.552,12,1C12,0.448,11.553,0,11,0L9,0C8.447,0,8,0.448,8,1C8,1.552,8.447,2,9,2L9,2.069C7.542,2.252,6.208,2.828,5.102,3.688L4.277,2.863C3.886,2.472,3.254,2.472,2.863,2.863C2.472,3.254,2.472,3.886,2.863,4.277L3.688,5.102C2.634,6.458,2,8.154,2,10C2,14.411,5.589,18,10,18C14.411,18,18,14.411,18,10C18,8.154,17.366,6.458,16.312,5.103ZM10,16C6.691,16,4,13.309,4,10C4,6.691,6.691,4,10,4C13.309,4,16,6.691,16,10C16,13.309,13.309,16,10,16Z"
            transform="translate(8,9) translate(-10,-9)"
          />
        </g>
        <S.SvgSpinner transform="translate(10,10) translate(-10,-10)">
          <ellipse opacity="0" fill="#93A3B0" rx="7" ry="7" transform="translate(10,10)" />
          <S.SvgSpinnerPath
            // eslint-disable-next-line max-len
            d="M10,11C9.447,11,9,10.552,9,10L9,6C9,5.448,9.447,5,10,5C10.553,5,11,5.448,11,6L11,10C11,10.552,10.553,11,10,11Z"
            transform="translate(10,8) translate(-10,-8)"
          />
        </S.SvgSpinner>
      </svg>
    </S.GifSpinnerContainer>
  )
}
