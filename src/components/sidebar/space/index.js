import React, { useCallback } from "react"
import { useSelector } from "react-redux"
import { createSelector } from "reselect"
import { Flex, Text, TextSmall, Collapsible, Button, TextNano } from "@netdata/netdata-ui"
import { selectIsUsingGlobalRegistry } from "domains/global/selectors"
import SignIn from "components/sidebar/signIn"
import getNodes from "./nodes"
import ReplicatedNodes from "./replicatedNodes"
import NoNetwork from "./noNetwork"
import SpacePanelIframe from "./spacePanelIframe"

const replicatedNodesSelector = createSelector(
  state => state.global.chartsMetadata.data || {},
  state => state.global.registry.fullInfoPayload.mirrored_hosts_status || {},
  ({ hosts, hostname }, hostsStatus) => getNodes(hosts, hostname, hostsStatus)
)

const visitedNodesSelector = createSelector(
  state => state.global.registry,
  registry => registry.registryMachinesArray || []
)

const Space = ({ isOpen, toggle, offline, hasSignedInBefore, isSignedIn }) => {
  const { parentNode = {}, replicatedNodes = [] } = useSelector(replicatedNodesSelector)
  const visitedNodes = useSelector(visitedNodesSelector)
  const globalRegistry = useSelector(selectIsUsingGlobalRegistry)

  const switchIdentity = useCallback(() => window.switchRegistryModalHandler(), [])

  return (
    <Collapsible width={74} background="panel" open={isOpen} direction="horizontal" persist>
      <Flex
        flex
        width={74}
        column
        overflow={{ vertical: "hidden" }}
        margin={[3, 0, 0]}
        border={{ side: "left", color: "separator" }}
        style={{ pointerEvents: "all" }}
      >
        <Flex overflow={{ vertical: "auto" }} flex column gap={4} padding={[4]}>
          <Flex alignSelf="end">
            <Button
              neutral
              flavour="borderless"
              themeType="dark"
              small
              icon="chevron_left"
              onClick={toggle}
            />
          </Flex>
          {!isSignedIn && (
            <>
              {!!replicatedNodes.length && (
                <ReplicatedNodes parentNode={parentNode} replicatedNodes={replicatedNodes} />
              )}
              {!!visitedNodes.length && (
                <Text strong color="border">
                  VisitedNodes
                </Text>
              )}
            </>
          )}
          {isSignedIn && (
            <SpacePanelIframe parentNode={parentNode} replicatedNodes={replicatedNodes} />
          )}
        </Flex>
        {globalRegistry && (
          <Flex border={{ side: "top" }} justifyContent="center" alignItems="center" padding={[6]}>
            <TextSmall onClick={switchIdentity}>Switch Identity</TextSmall>
          </Flex>
        )}
        {!offline && !hasSignedInBefore && (
          <Flex
            alignItems="center"
            background={["white", "pure"]}
            column
            gap={2}
            padding={[10]}
            border={{ side: "right", color: "panel" }}
          >
            <TextSmall color={["black", "pure"]} strong textAlign="center">
              Discover your monitoring superpowers
            </TextSmall>
            <TextNano color="black" textAlign="center">
              Do you know that you can manage a lot of nodes with Netdata Cloud?
            </TextNano>
            <SignIn />
          </Flex>
        )}
        {offline && hasSignedInBefore && (
          <Flex
            alignItems="center"
            background="sectionHeaderBackground"
            column
            gap={1}
            padding={[10]}
          >
            <TextSmall color={["black", "pure"]} strong textAlign="center">
              Can't connect to Netdata Cloud
            </TextSmall>
            <NoNetwork />
            <TextNano color="black" textAlign="center" margin={[2, 0, 0]}>
              Maybe you are behind a firewall or you don’t have connection to the internet
            </TextNano>
          </Flex>
        )}
      </Flex>
    </Collapsible>
  )
}

export default React.memo(Space)
