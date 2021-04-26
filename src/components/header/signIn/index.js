import React from "react"
import { useSelector } from "react-redux"
import { Button } from "@netdata/netdata-ui"
import SignInButton from "components/auth/signIn"
import SignInIframe from "components/auth/signIn/iframe"
import useCheckSignInStatus from "components/auth/signIn/useCheckSignInStatus"
import { selectIsCloudEnabled } from "domains/global/selectors"

const SignIn = () => {
  const [signedIn] = useCheckSignInStatus()
  const cloudEnabled = useSelector(selectIsCloudEnabled)

  return (
    cloudEnabled && (
      <React.Fragment>
        <SignInIframe signedIn={signedIn} />
        {!signedIn && (
          <SignInButton>
            {({ isRegistry, link, hasSignedInBefore, offline, onSignIn }) => (
              <Button
                label={hasSignedInBefore ? "SIGN IN TO CLOUD" : "SIGN UP TO CLOUD"}
                disabled={offline}
                {...(isRegistry ? { as: "a", href: link } : { onClick: onSignIn })}
              />
            )}
          </SignInButton>
        )}
      </React.Fragment>
    )
  )
}

export default SignIn
