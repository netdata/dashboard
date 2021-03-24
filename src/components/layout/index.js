import React, { useMemo } from "react"
import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"
import Header from "components/header"
import Sidebar from "components/sidebar"

const Wrapper = styled(Flex).attrs({
  position: "fixed",
  justifyContent: "start",
  alignItems: "start",
  width: "100%",
  elevation: 10,
})`
  top: 0;
  left: 0;
  pointer-events: none;
`

const Layout = ({ children, printMode }) => {
  const memoizedChildren = useMemo(() => children, [children])

  if (printMode) return memoizedChildren

  return (
    <Wrapper>
      <Sidebar />
      <Header />
      {memoizedChildren}
    </Wrapper>
  )
}

export default Layout
