import React, { useState } from "react"

import { List, SimpleListItem } from "@rmwc/list"
import { MenuSurface, MenuSurfaceAnchor } from "@rmwc/menu"

import * as S from "./styled"

export type DropdownMenu = { icon: string, label: string, onClick: (chartID: string) => void }[]

interface Props {
  chartID: string
  dropdownMenu: DropdownMenu
}

export const ChartDropdown = ({
  chartID,
  dropdownMenu,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <S.DotsBtn
        type="borderless"
        name="dots_2x3"
        onClick={() => {
          setIsOpen(true)
        }}
      />
      <MenuSurfaceAnchor>
        <MenuSurface open={isOpen} onClose={handleClose}>
          <List>
            {dropdownMenu.map(({ icon, label, onClick }) => (
              <SimpleListItem
                key={label}
                text={(
                  <S.DropdownItem>
                    {icon}
                    <S.DropdownItemLabel>
                      {label}
                    </S.DropdownItemLabel>
                  </S.DropdownItem>
                )}
                onClick={() => {
                  onClick(chartID)
                  handleClose()
                }}
              />
            ))}
          </List>
        </MenuSurface>
      </MenuSurfaceAnchor>
    </>
  )
}
