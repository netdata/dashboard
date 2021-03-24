import React, { useCallback, useState, useEffect } from "react"
import styled from "styled-components"
import { Flex } from "@netdata/netdata-ui"
import { useDispatch, useSelector } from "react-redux"
import { useLocalStorage } from "react-use"
import { selectSpacePanelIsActive } from "@/src/domains/global/selectors"
import { setSpacePanelStatusAction } from "@/src/domains/global/actions"
import Spaces from "./spaces"
import Space from "./space"
import SignInIframe from "./signIn/iframe"
import SignIn from "./signIn"
import useCheckSignInStatus from "./useCheckSignInStatus"

const Wrapper = styled(Flex).attrs({ height: "100vh", elevation: 10 })`
  pointer-events: all;
`

const SignInWrapper = styled(Flex).attrs({ position: "absolute" })`
  bottom: 16px;
  left: 80px;
`

const Sidebar = () => {
  const [offline, setOffline] = useState(false)
  const [lsValue, setLsValue] = useLocalStorage("space-panel-state")
  const [signedIn, hasSignedInBefore] = useCheckSignInStatus()
  const isOpen = useSelector(selectSpacePanelIsActive)
  const dispatch = useDispatch()

  const toggle = useCallback(() => {
    dispatch(setSpacePanelStatusAction({ isActive: !isOpen }))
    setLsValue(!isOpen)
  }, [isOpen])

  useEffect(() => {
    if (lsValue) dispatch(setSpacePanelStatusAction({ isActive: signedIn }))
    else dispatch(setSpacePanelStatusAction({ isActive: false }))
  }, [signedIn])

  return (
    <Wrapper>
      <Spaces
        isOpen={isOpen}
        toggle={toggle}
        isSignedIn={signedIn}
      />
      <Space
        isOpen={isOpen}
        toggle={toggle}
        offline={offline}
        hasSignedInBefore={hasSignedInBefore}
        isSignedIn={signedIn}
      />
      <SignInIframe signedIn={signedIn} setOffline={setOffline} />
      {!isOpen && !signedIn && (
        <SignInWrapper>
          <SignIn offline={offline} />
        </SignInWrapper>
      )}
    </Wrapper>
  )
}

export default Sidebar
