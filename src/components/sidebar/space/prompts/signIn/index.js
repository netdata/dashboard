import React from "react"
import { Flex, Text, Button } from "@netdata/netdata-ui"
import SignIn from "@/src/components/auth/signIn"
import promptContent from "./promptContent"

const SignInPrompt = () => {
  return (
    <SignIn>
      {({ isRegistry, link, hasSignedInBefore, onSignIn, offline }) => {
        const { title, content } = promptContent[hasSignedInBefore ? "signIn" : "signUp"]
        return (
          <Flex
            background="key"
            column
            gap={4}
            padding={[10]}
            border={{ side: "right", color: "panel" }}
          >
            <Text color="bright" strong>
              {title}
            </Text>
            {content.map(el => el)}
            <Button
              width="100%"
              label={hasSignedInBefore ? "SIGN IN TO CLOUD" : "SIGN UP TO CLOUD"}
              disabled={offline}
              {...(isRegistry ? { as: "a", href: link } : { onClick: onSignIn })}
            />
          </Flex>
        )
      }}
    </SignIn>
  )
}

export default SignInPrompt
