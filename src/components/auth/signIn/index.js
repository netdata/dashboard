import { useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createSelector } from "reselect"
import { useLocalStorage } from "react-use"
import { showSignInModalAction } from "domains/dashboard/actions"
import { selectSignInUrl, selectRegistry } from "domains/global/selectors"
import { NETDATA_REGISTRY_SERVER } from "utils/utils"

const isRegistrySelector = createSelector(
  selectRegistry,
  ({ registryServer }) => registryServer === NETDATA_REGISTRY_SERVER
)

const offlineSelector = createSelector(
  ({ dashboard }) => dashboard,
  ({ offline }) => offline
)

const SignIn = ({ children }) => {
  const [hasSignedInBefore] = useLocalStorage("has-sign-in-history")
  const signInUrl = useSelector(state => selectSignInUrl(hasSignedInBefore)(state))
  const isRegistry = useSelector(isRegistrySelector)
  const offline = useSelector(offlineSelector)

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

  return useMemo(
    () =>
      typeof children === "function"
        ? children({ isRegistry, link, onSignIn, offline, hasSignedInBefore })
        : children,
    [children, isRegistry, link, onSignIn, offline, hasSignedInBefore]
  )
}

export default SignIn
