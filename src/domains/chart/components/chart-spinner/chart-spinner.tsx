import React, { useState } from "react"
import { IconComponents } from "@netdata/netdata-ui"
import { Tooltip } from "@rmwc/tooltip"

import * as S from "./styled"

interface Props {
  chartLibrary: string
  isTakingTooLong: boolean
}
export const ChartSpinner = ({ chartLibrary, isTakingTooLong }: Props) => {
  const [hovered, setHovered] = useState(false)
  const top = chartLibrary === "dygraph" ? 33 : 0
  const right = chartLibrary === "dygraph" ? 8 : 0
  const size = chartLibrary === "dygraph" ? 10 : 7
  const spaceBetween = chartLibrary === "dygraph" ? 4 : 2
  return (
    <Tooltip open={hovered} content={isTakingTooLong ? "Data transfer seems slow :)" : "Data transfer in progress"} align="right">
      <S.SpinnerContainer
        top={top}
        right={right}
        warningLoader={isTakingTooLong}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <IconComponents.LoaderIcon className="loader-icon" />
      </S.SpinnerContainer>
    </Tooltip>
  )
}
