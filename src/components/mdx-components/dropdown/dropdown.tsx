import React, { ReactNode, ReactElement } from "react"
import { List } from "@rmwc/list"
import { MenuSurfaceAnchor, MenuSurface } from "@rmwc/menu"
import {
  RootContainer, ListContainer, DropdownContainer, OpenerIcon,
} from "./styled"

interface Props {
  isOpen: boolean
  onMenuToggle: (isOpen: boolean) => void
  title?: string
  renderTitle?: () => ReactElement
  renderOpener?: () => ReactElement | null
  children: ReactNode
  className?: string
  anchorCorner?: any
}

export const Dropdown = ({
  title,
  children,
  className,
  renderTitle,
  isOpen = false,
  onMenuToggle,
  anchorCorner = "bottomStart",
  renderOpener,
}: Props) => {
  const handleOpenState = () => {
    onMenuToggle(!isOpen)
  }

  const handleClose = () => {
    onMenuToggle(false)
  }

  return (
    <DropdownContainer className={className}>
      <MenuSurfaceAnchor>
        <MenuSurface open={isOpen} onClose={handleClose} anchorCorner={anchorCorner}>
          <ListContainer>
            <List>{children}</List>
          </ListContainer>
        </MenuSurface>
        <RootContainer onClick={handleOpenState}>
          {title || (renderTitle && renderTitle())}
          {renderOpener ? (
            renderOpener()
          ) : (
            <OpenerIcon name="triangle_down" noMargin={Boolean(renderTitle)} />
          )}
        </RootContainer>
      </MenuSurfaceAnchor>
    </DropdownContainer>
  )
}
