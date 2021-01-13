/* eslint-disable react/jsx-one-expression-per-line */
// @ts-nocheck
import React, { useMemo } from "react"
import { Flex, TextMicro } from "@netdata/netdata-ui"
import GroupBox from "./groupBox"
import Legend from "./legend"

interface GroupBoxWrapperProps {
  data: any
  title: string
}

const GroupBoxWrapper = ({ data, title, renderTooltip }: GroupBoxWrapperProps) => {
  const total = useMemo(() => data.data.length, [data])
  return (
    <Flex column alignItems="start" gap={1} margin={[0, 4, 0, 0]}>
      <TextMicro>
        {title} ({total})
      </TextMicro>
      <GroupBox data={data} renderTooltip={renderTooltip} />
    </Flex>
  )
}

const GroupBoxes = React.memo(({ id, chartData: { data, labels }, renderTooltip }: any) => {
  return (
    <Flex column width="100%" height="100%" gap={4} padding={[4, 2]}>
      <Flex flexWrap overflow={{ vertical: "auto" }} flex>
        {labels.map((label, index) => {
          const tooltip =
            renderTooltip &&
            ((props, a) => renderTooltip({ group: label, groupIndex: index, ...props }, a))
          return (
            <GroupBoxWrapper key={label} title={label} data={data[index]} renderTooltip={tooltip} />
          )
        })}
      </Flex>
      <Legend>{id}</Legend>
    </Flex>
  )
})

export default GroupBoxes
