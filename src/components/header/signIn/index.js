import React from "react"
import { Button } from "@netdata/netdata-ui"
import SignInButton from "components/auth/signIn"
import SignOutButton from "components/auth/signOut"
import SignInIframe from "components/auth/signIn/iframe"
import useCheckSignInStatus from "components/auth/signIn/useCheckSignInStatus"

const SignIn = () => {
  const [signedIn] = useCheckSignInStatus()

  return (
    <React.Fragment>
      <SignInIframe signedIn={signedIn} />
      {!signedIn ? (
        <SignInButton>
          {({ isRegistry, link, hasSignedInBefore, offline, onSignIn }) => (
            <Button
              label={hasSignedInBefore ? "SIGN IN TO CLOUD" : "SIGN UP TO CLOUD"}
              disabled={offline}
              {...(isRegistry ? { as: "a", href: link } : { onClick: onSignIn })}
            />
          )}
        </SignInButton>
      ) : (
        <SignOutButton flavour="hollow" />
      )}
    </React.Fragment>
  )
}

export default SignIn
