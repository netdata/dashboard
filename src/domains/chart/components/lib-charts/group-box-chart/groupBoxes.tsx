/* eslint-disable react/jsx-one-expression-per-line */
// @ts-nocheck
import React from "react"
import { Flex, TextMicro, Popover } from "@netdata/netdata-ui"
import GroupBox from "./groupBox"
import Legend from "./legend"

interface GroupBoxWrapperProps {
  data: any
  title: string
}

const GroupBoxWrapper = ({
  data,
  label,
  renderGroupTooltip,
  renderBoxTooltip,
}: GroupBoxWrapperProps) => {
  return (
    <Flex column alignItems="start" gap={1} margin={[0, 4, 0, 0]}>
      <Popover content={renderGroupTooltip}>
        <TextMicro>
          {label} ({data.data.length})
        </TextMicro>
      </Popover>
      <GroupBox data={data} renderTooltip={renderBoxTooltip} />
    </Flex>
  )
}

const GroupBoxes = React.memo(
  ({ id, chartData: { data, labels }, renderBoxTooltip, renderGroupTooltip }: any) => {
    return (
      <Flex column width="100%" height="100%" gap={4} padding={[4, 2]}>
        <Flex flexWrap overflow={{ vertical: "auto" }} flex>
          {labels.map((label, index) => {
            const boxTooltip =
              renderBoxTooltip &&
              ((props) => renderBoxTooltip({ group: label, groupIndex: index, ...props }))

            const groupTooltip =
              renderGroupTooltip && (() => renderGroupTooltip({ group: label, groupIndex: index }))

            return (
              <GroupBoxWrapper
                key={label}
                label={label}
                data={data[index]}
                renderGroupTooltip={groupTooltip}
                renderBoxTooltip={boxTooltip}
              />
            )
          })}
        </Flex>
        <Legend>{id}</Legend>
      </Flex>
    )
  }
)

export default GroupBoxes
