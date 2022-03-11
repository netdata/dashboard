import styled from "styled-components"
import React, { useRef } from "react"
import { useMedia, useToggle } from "react-use"
import { Drop, Flex, Icon, Pill, Text } from "@netdata/netdata-ui"
import { useSelector } from "store/redux-separate-context"
import { selectLacksProtoBufSupport } from "domains/global/selectors"

import Dropdown from "./dropdown"

const PillContainer = styled(Flex)`
  white-space: nowrap;
`

const Link = styled(Text).attrs({ as: "a", color: "success", target: "_blank" })``

const breakpoint = "(min-width: 1400px)"

const ProtoBuf = () => {
  const [isOpen, toggle] = useToggle()
  const lacksProtoBufSupport = useSelector(selectLacksProtoBufSupport)

  const ref = useRef()

  const isLargeEnough = useMedia(breakpoint)

  const close = () => {
    toggle(false)
  }
  if (!lacksProtoBufSupport) return null

  return (
    <Flex flex={false}>
      <PillContainer ref={ref}>
        <Pill
          data-testid="header-options-button"
          onClick={toggle}
          flavour="warning"
          icon="warning_triangle_hollow"
        >
          {isLargeEnough ? "NOT MONITORED IN CLOUD" : ""}
        </Pill>
      </PillContainer>
      {ref.current && isOpen && (
        <Drop
          target={ref.current}
          align={{ top: "bottom", left: "left" }}
          onEsc={close}
          onClickOutside={close}
          animation
        >
          <Dropdown>
            <Flex background="modalTabsBackground" padding={[4]}>
              <Flex width={14} flex={false} alignItems="start">
                <Flex padding={[2.5]} round="50%" background="warningText">
                  <Icon color="warningBackground" name="informationPress" />
                </Flex>
              </Flex>
              <Flex>
                <Text>
                  It will not be possible to monitor this node from Netdata Cloud after 1st of
                  March. <br /> <br />
                  This node does not have proto-buf support. In order to learn how to apply
                  proto-buf support to your nodes{" "}
                  <Link href="https://www.netdata.cloud/blog/netdata-clouds-new-architecture">
                    read our documentation.
                  </Link>
                  <br />
                  <br /> If you are not interested in monitoring this node from Netdata Cloud, you
                  can{" "}
                  <Link href="https://learn.netdata.cloud/docs/agent/claim#remove-and-reconnect-a-node">
                    unclaim it.
                  </Link>
                </Text>
              </Flex>
            </Flex>
          </Dropdown>
        </Drop>
      )}
    </Flex>
  )
}

export default ProtoBuf
