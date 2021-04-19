import React from "react"
import { Flex } from "@netdata/netdata-ui"
import { getIframeSrc } from "@/src/utils"

const SignOut = ({ flavour = "default", ...rest }) => {
  return (
    <Flex
      alignItems="center"
      as="iframe"
      src={`${getIframeSrc("https://staging.netdata.cloud", "sign-out")}?type=${flavour}`}
      border={{ side: "all", size: "0px" }}
      width={{ max: "128px" }}
      height={{ max: "40px" }}
      {...rest}
    />
  )
}

export default SignOut
