import React, { useRef } from "react"
import { List } from "@rmwc/list"
import { MenuSurfaceAnchor, MenuSurface } from "@rmwc/menu"
import { RootContainer, ListContainer, DropdownContainer, OpenerIcon } from "./styled"

export const Dropdown = ({
  title,
  children,
  className,
  renderTitle,
  isOpen = false,
  onMenuToggle,
  anchorCorner = "bottomStart",
  renderOpener,
}) => {
  const ref = useRef()

  const handleOpenState = () => {
    onMenuToggle(!isOpen)
  }

  const handleClose = () => {
    onMenuToggle(false)
  }

  return (
    <DropdownContainer className={className}>
      <MenuSurfaceAnchor>
        <MenuSurface ref={ref} open={isOpen} onClose={handleClose} anchorCorner={anchorCorner}>
          {typeof children === "function" ? (
            isOpen && (
              <ListContainer>
                <List>{children({ maxHeight: ref.current?.root.ref.style.maxHeight })}</List>
              </ListContainer>
            )
          ) : (
            <ListContainer>
              <List>{children}</List>
            </ListContainer>
          )}
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
