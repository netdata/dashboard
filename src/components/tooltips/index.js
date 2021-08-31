import React, { useCallback } from "react"
import { Tooltip as BaseTooltip } from "@netdata/netdata-ui"
import getContent from "./getContent"

const Tooltip = ({ children, content, isBasic, ...rest }) => {
  const getTooltipContent = useCallback(() => getContent(content, { isBasic }), [content, isBasic])
  return (
    <BaseTooltip plain animation content={getTooltipContent} {...rest}>
      {children}
    </BaseTooltip>
  )
}

export default Tooltip
