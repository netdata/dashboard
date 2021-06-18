import React, { memo, Fragment } from "react"
import styled from "styled-components"
import { useToggle } from "react-use"
import { Flex, Icon, Tooltip, Drop } from "@netdata/netdata-ui"
import { MenuItem } from "@/src/components/menus"
import { useDispatch } from "store/redux-separate-context"
import { resetGlobalPauseAction, setGlobalPauseAction } from "domains/global/actions"
import PlayOptionsTooltip from "./playOptionsTooltip"

const MenuButton = styled(Flex).attrs({ padding: [1], role: "button" })`
  cursor: pointer;
`

const Dropdown = styled(Flex).attrs({
  column: true,
  padding: [2],
  background: "dropdown",
  round: 1,
  overflow: { vertical: "auto" },
  margin: [2, 0, 0],
  width: 40,
})`
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const PlayOptions = ({ target }) => {
  const dispatch = useDispatch()
  const [isOpen, toggle] = useToggle()

  const close = () => toggle(false)

  const onPlay = () => {
    dispatch(resetGlobalPauseAction({ forcePlay: false }))
    close()
  }

  const onPause = () => {
    dispatch(setGlobalPauseAction())
    close()
  }

  const onForcePlay = () => {
    dispatch(resetGlobalPauseAction({ forcePlay: true }))
    close()
  }

  return (
    <Fragment>
      {!isOpen ? (
        <Tooltip
          content={<PlayOptionsTooltip />}
          align={{ bottom: "bottom", right: "right" }}
          plain
        >
          <MenuButton onClick={toggle} width="auto">
            <Icon name="chevron_down" color="text" width="12px" height="12px" />
          </MenuButton>
        </Tooltip>
      ) : (
        <MenuButton onClick={toggle} width="auto">
          <Icon name="chevron_down" color="text" width="12px" height="12px" />
        </MenuButton>
      )}
      {target.current && isOpen && (
        <Drop
          target={target.current}
          align={{ top: "bottom", left: "left" }}
          onEsc={close}
          onClickOutside={close}
          animation
        >
          <Dropdown>
            <MenuItem round={1} icon="playOutline" onClick={onPlay}>
              Play
            </MenuItem>
            <MenuItem round={1} icon="pauseOutline" onClick={onPause}>
              Pause
            </MenuItem>
            <MenuItem round={1} icon="forcePlayOutline" onClick={onForcePlay}>
              Force Play
            </MenuItem>
          </Dropdown>
        </Drop>
      )}
    </Fragment>
  )
}

const MemoizedPlayOptions = memo(PlayOptions)

export default MemoizedPlayOptions
