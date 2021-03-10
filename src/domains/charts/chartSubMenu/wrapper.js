import React, { forwardRef } from "react"
import { Flex } from "@netdata/netdata-ui"
import { useSubMenu } from "@/src/domains/charts/subMenu/context"

export const ChartSubMenusWrapper = forwardRef((props, ref) => (
  <Flex column gap={2} ref={ref} {...props} />
))

const linkSelector = ({ link }) => link

export const ChartSubMenuContainer = forwardRef(({ id, ...rest }, ref) => {
  const link = useSubMenu(id, linkSelector)
  return <Flex column gap={2} id={link} data-submenuid={id} ref={ref} {...rest} />
})
