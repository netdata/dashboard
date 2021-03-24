import React, { useMemo } from "react"
import { ThemeProvider } from "styled-components"
import { Flex, Menu, Icon, DarkTheme } from "@netdata/netdata-ui"
import { getIframeSrc } from "@/src/utils"

const UserSettings = () => {
  const menuItems = useMemo(() => [{ children: "Sign Out" }], [])

  return (
    <ThemeProvider theme={DarkTheme}>
      <Menu
        icon={<Icon name="user" size="small" color="text" />}
        caret={false}
        items={menuItems}
        padding={[2]}
        renderDropdown={() => (
          <Flex margin={[5, 18]} column width={52} background="mainBackground" padding={[3]} round>
            <Flex
              alignItems="center"
              as="iframe"
              src={getIframeSrc("https://staging.netdata.cloud", "sign-out")}
              border={{ side: "all", size: "0px" }}
              height="24px"
            />
          </Flex>
        )}
        dropProps={{ align: { top: "top", right: "right" } }}
      />
    </ThemeProvider>
  )
}

export default UserSettings
