import React from "react"
import { useSelector } from "react-redux"
import { Button } from "@netdata/netdata-ui"
import SignInButton from "components/auth/signIn"
import SignInIframe from "components/auth/signIn/iframe"
import useCheckSignInStatus from "components/auth/signIn/useCheckSignInStatus"
import { selectIsCloudEnabled } from "domains/global/selectors"
import Tooltip from "@/src/components/tooltips"

const SignIn = () => {
  const [signedIn] = useCheckSignInStatus()
  const cloudEnabled = useSelector(selectIsCloudEnabled)

  return (
    cloudEnabled && (
      <Tooltip
        content="Sign in to Netdata to monitor all your nodes at once, have composite charts, custom dashboards, use intelligent features and more"
        align="bottom"
        plain
      >
        <div>
          <SignInIframe signedIn={signedIn} />
          {!signedIn && (
            <SignInButton utmParameters={{ content: "topbar" }}>
              {({ isRegistry, link, offline, onSignIn }) => (
                <Button
                  data-testid="header-signin"
                  label="Sign in"
                  disabled={offline}
                  {...(isRegistry ? { as: "a", href: link } : { onClick: onSignIn })}
                />
              )}
            </SignInButton>
          )}
        </div>
      </Tooltip>
    )
  )
}

export default SignIn
