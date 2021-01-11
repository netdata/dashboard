import React, { useMemo } from "react"
import { Flex, TextMicro } from "@netdata/netdata-ui"
import GroupBox from "./groupBox"
import Legend from "./legend"

interface GroupBoxWrapperProps {
  data: any
  title: string
}

const GroupBoxWrapper = ({ data, title }: GroupBoxWrapperProps) => {
  const total = useMemo(() => data.data.length, [data])
  return (
    <Flex column alignItems="start" gap={1} margin={[0, 4, 0, 0]}>
      <TextMicro>
        {title}
        {" "}
(
        {total}
)
      </TextMicro>
      <GroupBox data={data} />
    </Flex>
  )
}

const GroupBoxes = React.memo(({ chartData }: any) => {
  const { groupedBoxes, id } = chartData
  return (
    <Flex column width="100%" height="100%" gap={4} padding={[4, 2]}>
      <Flex flexWrap overflow={{ vertical: "auto" }}>
        {Object.keys(groupedBoxes).map((key) => (
          <GroupBoxWrapper key={key} title={key} data={groupedBoxes[key]} />
        ))}
      </Flex>
      <Legend>{id}</Legend>
    </Flex>
  )
})

export { GroupBoxes }
