import React from "react"
import { Flex, Button, Documentation } from "@netdata/netdata-ui"
import ExpandButton from "./expandButton"
import UserSettings from "./userSettings"
import SpacesSkeleton from "./spacesSkeleton"
import SpacesIframe from "./spacesIframe"
import NetdataLogo from "../netdataLogo"

const Spaces = ({ isOpen, toggle, isSignedIn }) => {
  return (
    <Flex
      column
      justifyContent="between"
      background="panel"
      padding={[3, 0]}
      width="64px"
      alignItems="center"
      gap={6}
      position="relative"
      overflow="hidden"
    >
      <Flex column gap={4} alignItems="center" height="100%" overflow="hidden">
        <NetdataLogo width={32} height={32} />
        {!isOpen && (
          <ExpandButton
            icon="chevron_right_s"
            onClick={toggle}
            small
            neutral
            flavour="borderless"
            themeType="dark"
          />
        )}
        {isSignedIn ? <SpacesIframe /> : <SpacesSkeleton />}
      </Flex>
      <Flex column gap={4} alignItems="center">
        <Documentation app="agent">
          {toggle => (
            <Button
              flavour="borderless"
              neutral
              themeType="dark"
              className="btn"
              icon="question"
              onClick={toggle}
              title="Need help?"
            />
          )}
        </Documentation>
        <Button
          flavour="borderless"
          neutral
          themeType="dark"
          className="btn"
          data-toggle="modal"
          data-target="#optionsModal"
          icon="gear"
          title="Settings"
        />
        <UserSettings />
      </Flex>
    </Flex>
  )
}

export default Spaces
