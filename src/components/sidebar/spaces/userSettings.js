import React, { useMemo } from "react"
import { ThemeProvider } from "styled-components"
import { createSelector } from "reselect"
import { useToggle } from "react-use"
import { Flex, Button, DarkTheme, Text, Layer } from "@netdata/netdata-ui"
import { useSelector } from "store/redux-separate-context"
import { MenuItem } from "components/menus"
import SignOut from "components/auth/signOut"
import SignIn from "components/auth/signIn"

const SignInItem = () => {
  const onClick = (e, link) => {
    e.stopPropagation()
    window.open(link, "_blank", "noopener,noreferrer")
  }
  return (
    <SignIn utmParameters={{ content: "userSettings" }}>
      {({ isRegistry, link, onSignIn }) => (
        <Text onClick={isRegistry ? e => onClick(e, link) : onSignIn}>Sign in</Text>
      )}
    </SignIn>
  )
}

const isSignedInSelector = createSelector(
  ({ dashboard }) => dashboard,
  ({ isSignedIn }) => isSignedIn
)

const UserSettings = () => {
  const [isOpen, toggle] = useToggle()
  const signedIn = useSelector(isSignedInSelector)

  const menuItems = useMemo(
    () => [
      ...(signedIn
        ? [
            {
              children: "Operational Status",
              onClick: () =>
                window.open("https://status.netdata.cloud", "_blank", "noopener,noreferrer"),
            },
          ]
        : []),
      ...(signedIn ? [{ separator: true }] : []),
      ...(signedIn
        ? [
            {
              children: (
                <SignOut
                  data-testid="signout-button-sidebar"
                  flavour="borderless"
                  height={{ max: "18px" }}
                />
              ),
            },
          ]
        : [{ children: <SignInItem /> }]),
    ],
    [signedIn]
  )

  return (
    <ThemeProvider theme={DarkTheme}>
      <Button
        data-testid="avatar-button-sidebar"
        flavour="borderless"
        neutral
        icon="user"
        title="User settings"
        name="userSettings"
        onClick={toggle}
      />
      {isOpen && (
        <Layer
          position="bottom-left"
          onClickOutside={toggle}
          onEsc={toggle}
          backdrop={false}
          margin={[5, 18]}
        >
          <Flex column width={52} background="mainBackground" padding={[3]} round>
            {menuItems.map((item, i) => {
              if (item.separator) return <Flex height="1px" background="disabled" key={i} />
              return (
                <MenuItem
                  key={i}
                  padding={[2, 4]}
                  round={1}
                  {...(item.onClick && { onClick: item.onClick })}
                >
                  {item.children}
                </MenuItem>
              )
            })}
          </Flex>
        </Layer>
      )}
    </ThemeProvider>
  )
}

export default UserSettings
