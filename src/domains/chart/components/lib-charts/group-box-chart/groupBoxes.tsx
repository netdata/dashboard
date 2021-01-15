/* eslint-disable react/jsx-one-expression-per-line */
// @ts-nocheck
import React, { useRef, useMemo } from "react"
import styled from "styled-components"
import { Flex, TextMicro, Popover, getColor } from "@netdata/netdata-ui"
import GroupBox from "./groupBox"
import { getWidth } from "./drawBoxes"
import Legend from "./legend"
import getAlign from "./getAlign"

interface GroupBoxWrapperProps {
  data: any
  title: string
}

const Title = styled(TextMicro)`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;

  &:hover {
    font-weight: bold;
    color: ${getColor("textFocus")};
  }
`

const GroupBoxWrapper = ({
  data,
  label,
  groupIndex,
  renderGroupPopover,
  renderBoxPopover,
}: GroupBoxWrapperProps) => {
  const ref = useRef()
  const align = ref.current && getAlign(ref.current)

  const style = useMemo(() => ({ width: `${getWidth(data.data)}px` }), [data])

  const boxPopover =
    renderBoxPopover &&
    ((props, boxAlign) => renderBoxPopover({ group: label, groupIndex, align: boxAlign, ...props }))

  const groupPopover =
    renderGroupPopover && (() => renderGroupPopover({ group: label, groupIndex, align }))

  return (
    <Flex column alignItems="start" gap={1} margin={[0, 4, 0, 0]}>
      <Popover content={groupPopover} align={align} plain>
        <Title ref={ref} style={style}>
          {label} ({data.data.length})
        </Title>
      </Popover>
      <GroupBox data={data} renderTooltip={boxPopover} />
    </Flex>
  )
}

const GroupBoxes = ({
  id,
  chartData: { data, labels },
  renderBoxPopover,
  renderGroupPopover,
}: any) => (
  <Flex column width="100%" height="100%" gap={4} padding={[4, 2]}>
    <Flex flexWrap overflow={{ vertical: "auto" }} flex>
      {labels.map((label, index) => {
        return data[index].data.length ? (
          <GroupBoxWrapper
            key={label}
            label={label}
            groupIndex={index}
            data={data[index]}
            renderGroupPopover={renderGroupPopover}
            renderBoxPopover={renderBoxPopover}
          />
        ) : null
      })}
    </Flex>
    <Legend>{id}</Legend>
  </Flex>
)

export default GroupBoxes
