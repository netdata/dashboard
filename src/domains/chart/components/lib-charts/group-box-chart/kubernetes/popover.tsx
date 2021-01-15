// @ts-nocheck
import React from "react"
import { H5, H6, Text, Flex, Icon, DropContainer } from "@netdata/netdata-ui"

export const Section = ({ title, children, noBorder }) => (
  <Flex
    gap={3}
    padding={[0, 0, 3]}
    border={!noBorder && { side: "bottom", color: ["gray", "shuttleGray"] }}
    column
  >
    <H6 color={["gray", "aluminium"]} wordBreak="break-all">
      {title}
    </H6>

    <Flex gap={2} column>
      {children}
    </Flex>
  </Flex>
)

export const Item = ({ icon, title, secondary }) => (
  <Flex gap={1} alignItems="start">
    <Flex width="22px" height="22px">
      <Icon
        name={icon}
        color={["white", "pure"]}
        margin={[0, 1, 0, 0]}
        width="22px"
        height="22px"
      />
    </Flex>
    <Text color={["white", "pure"]}>{title}</Text>
    {secondary && (
      <Text color="border" wordBreak="break-all">
        {secondary}
      </Text>
    )}
  </Flex>
)

const Container = ({ title, children, align = "top" }) => (
  <DropContainer
    align={align}
    background={["transparent", "popover"]}
    padding={[2, 4]}
    width="320px"
    height={{ max: "420px" }}
    gap={3}
  >
    <H5 color={["white", "pure"]} wordBreak="break-all">
      {title}
    </H5>
    <Flex column gap={3} overflow={{ vertical: "auto", horizontal: "hidden" }}>
      {children}
    </Flex>
  </DropContainer>
)

export default Container
