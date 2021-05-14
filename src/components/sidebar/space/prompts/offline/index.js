import React from "react"
import { Flex, TextNano, TextSmall } from "@netdata/netdata-ui"
import NoNetwork from "./noNetwork"

const OfflinePrompt = () => (
  <Flex alignItems="center" background={["neutral", "regentgrey"]} column gap={1} padding={[10]}>
    <TextSmall color="bright" strong textAlign="center">
      Can't connect to Netdata Cloud
    </TextSmall>
    <NoNetwork />
    <TextNano color="bright" textAlign="center" margin={[2, 0, 0]}>
      Maybe you are behind a firewall or you don’t have connection to the internet
    </TextNano>
  </Flex>
)

export default OfflinePrompt
