import React from "react"
import { useSelector } from "react-redux"
import { Flex } from "@netdata/netdata-ui"
import { selectCloudBaseUrl } from "domains/global/selectors"
import { getIframeSrc } from "@/src/utils"


const SignOut = ({ flavour = "default", ...rest }) => {
  const cloudBaseURL = useSelector(selectCloudBaseUrl)

  return (
    <Flex
      alignItems="center"
      as="iframe"
      src={`${getIframeSrc(cloudBaseURL, "sign-out")}?type=${flavour}`}
      border={{ side: "all", size: "0px" }}
      width={{ max: "128px" }}
      height={{ max: "40px" }}
      {...rest}
    />
  )
}

export default SignOut
