import React, { useCallback, useEffect } from "react"
import styled from "styled-components"
import { createSelector } from "reselect"
import { Flex } from "@netdata/netdata-ui"
import { useDispatch, useSelector } from "react-redux"
import { useLocalStorage } from "react-use"
import { selectSpacePanelIsActive } from "@/src/domains/global/selectors"
import { setSpacePanelStatusAction } from "@/src/domains/global/actions"
import Spaces from "./spaces"
import Space from "./space"

const Wrapper = styled(Flex).attrs({ height: "100vh", zIndex: 10 })`
  pointer-events: all;
`

const isSignedInSelector = createSelector(
  ({ dashboard }) => dashboard,
  ({ isSignedIn }) => isSignedIn
)

const Sidebar = () => {
  const [lsValue, setLsValue] = useLocalStorage("space-panel-state")
  const isOpen = useSelector(selectSpacePanelIsActive)
  const signedIn = useSelector(isSignedInSelector)

  const dispatch = useDispatch()

  const toggle = useCallback(() => {
    dispatch(setSpacePanelStatusAction({ isActive: !isOpen }))
    setLsValue(!isOpen)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    dispatch(setSpacePanelStatusAction({ isActive: lsValue ? signedIn : false }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn])

  return (
    <Wrapper>
      <Spaces isOpen={isOpen} toggle={toggle} isSignedIn={signedIn} />
      <Space isOpen={isOpen} toggle={toggle} offline={true} />
    </Wrapper>
  )
}

export default React.memo(Sidebar)
