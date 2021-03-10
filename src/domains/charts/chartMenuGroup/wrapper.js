import React, { forwardRef } from "react"
import { Flex } from "@netdata/netdata-ui"

export const ChartMenuGroupWrapper = forwardRef(({ id, ...rest }, ref) => (
  <Flex column data-menuid={id} ref={ref} {...rest} />
))
