import React from "react"
import { Flex, Button } from "@netdata/netdata-ui"

const SpacesSkeleton = () => (
  <React.Fragment>
    <Flex
      width="40px"
      height="40px"
      round={2}
      border={{ side: "all", color: "border", size: "2px", type: "dotted" }}
    />
    <Flex height="1px" background="separator" width="20px" />
    <Button icon="plus" disabled />
  </React.Fragment>
)

export default SpacesSkeleton
