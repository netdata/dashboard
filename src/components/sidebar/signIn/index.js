import React, { useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@netdata/netdata-ui"
import { showSignInModalAction } from "domains/dashboard/actions"
import { selectSignInUrl, selectRegistry } from "domains/global/selectors"
import { NETDATA_REGISTRY_SERVER } from "utils/utils"

const SignIn = ({ offline }) => {
  const signInUrl = useSelector(selectSignInUrl)
  const registry = useSelector(selectRegistry)

  const dispatch = useDispatch()

  const link = useMemo(() => {
    const { href } = window.location
    const redirectURI = encodeURIComponent(href)
    return `${signInUrl}&redirect_uri=${redirectURI}`
  }, [signInUrl])

  const onSignIn = useCallback(
    () =>
      dispatch(
        showSignInModalAction({
          signInLinkHref: link,
        })
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [link]
  )

  return registry.registryServer === NETDATA_REGISTRY_SERVER ? (
    <Button as="a" href={link} label="SIGN IN TO CLOUD" disabled={offline} />
  ) : (
    <Button label="SIGN IN TO CLOUD" onClick={onSignIn} disabled={offline} />
  )
}

export default SignIn
