import React from "react"
import { Flex, Text, Button } from "@netdata/netdata-ui"
import SignIn from "@/src/components/auth/signIn"
import promptContent from "./promptContent"

const SignInPrompt = () => {
  return (
    <SignIn utmParameters={{ content: "sidebar" }}>
      {({ isRegistry, link, onSignIn, offline }) => {
        const { title, content } = promptContent["signIn"]
        return (
          <Flex
            background={["neutral", "regentgrey"]}
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
              label="SIGN IN TO CLOUD"
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
