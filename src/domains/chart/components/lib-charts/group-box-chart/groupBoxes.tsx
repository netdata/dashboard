/* eslint-disable react/jsx-one-expression-per-line */
// @ts-nocheck
import React, { useRef, useMemo } from "react"
import styled from "styled-components"
import { Flex, TextMicro, Popover, getColor } from "@netdata/netdata-ui"
import GroupBox from "./groupBox"
import { getWidth } from "./drawBoxes"
import getAlign from "./getAlign"

interface GroupBoxWrapperProps {
  data: any
  title: string
}

const Title = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
`

const Label = styled(Flex).attrs({
  as: TextMicro,
  gap: 1,
})`
  cursor: default;
  &:hover {
    font-weight: bold;
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

  const style = useMemo(() => ({ maxWidth: `${getWidth(data.data)}px` }), [data])

  const boxPopover =
    renderBoxPopover &&
    ((index, boxAlign) => renderBoxPopover({ group: label, groupIndex, align: boxAlign, index }))

  const groupPopover =
    renderGroupPopover && (() => renderGroupPopover({ group: label, groupIndex, align }))

  return (
    <Flex column alignItems="start" gap={1} margin={[0, 4, 0, 0]}>
      <Popover content={groupPopover} align={align} plain>
        {({ isOpen, ref: popoverRef, ...rest }) => {
          return (
            <Label
              ref={(el) => {
                ref.current = el
                popoverRef(el)
              }}
              strong={isOpen}
              style={style}
              {...rest}
            >
              <Title>{label}</Title>
              {data.data.length > 3 && <span>({data.data.length})</span>}
            </Label>
          )
        }}
      </Popover>
      <GroupBox data={data} renderTooltip={boxPopover} />
    </Flex>
  )
}

const GroupBoxes = ({ data, labels, renderBoxPopover, renderGroupPopover }: any) => (
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
)

export default GroupBoxes
