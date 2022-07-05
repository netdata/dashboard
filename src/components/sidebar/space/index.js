import React, { useCallback } from "react"
import { useSelector } from "react-redux"
import { createSelector } from "reselect"
import { Flex, Text, TextSmall, Collapsible, Button } from "@netdata/netdata-ui"
import { selectIsUsingGlobalRegistry, selectIsCloudEnabled } from "domains/global/selectors"
import getNodes from "./nodes"
import ReplicatedNodes from "./replicatedNodes"
import SpacePanelIframe from "./spacePanelIframe"
import SignInPrompt from "./prompts/signIn"
import OfflinePrompt from "./prompts/offline"
import VisitedNodes from "./visitedNodes"

const replicatedNodesSelector = createSelector(
  state => state.global.chartsMetadata.data || {},
  state => state.global.registry.fullInfoPayload.mirrored_hosts_status || {},
  ({ hosts, hostname }, hostsStatus) => getNodes(hosts, hostname, hostsStatus)
)

const visitedNodesSelector = createSelector(
  state => state.global.registry,
  registry => registry.registryMachinesArray || []
)

const isSignedInSelector = createSelector(
  ({ dashboard }) => dashboard,
  ({ isSignedIn, offline }) => ({ isSignedIn, offline })
)

const Space = ({ isOpen, toggle }) => {
  const { parentNode = {}, replicatedNodes = [] } = useSelector(replicatedNodesSelector)
  const visitedNodes = useSelector(visitedNodesSelector)
  const globalRegistry = useSelector(selectIsUsingGlobalRegistry)
  const { isSignedIn, offline } = useSelector(isSignedInSelector)
  const cloudEnabled = useSelector(selectIsCloudEnabled)

  const switchIdentity = useCallback(() => window.switchRegistryModalHandler(), [])

  return (
    <Collapsible width={74} background="panel" open={isOpen} direction="horizontal" persist>
      <Flex
        flex
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
                  <VisitedNodes machinesArray={visitedNodes} />
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
        {!isSignedIn && cloudEnabled && <SignInPrompt />}
        {offline && cloudEnabled && <OfflinePrompt />}
      </Flex>
    </Collapsible>
  )
}

export default React.memo(Space)
