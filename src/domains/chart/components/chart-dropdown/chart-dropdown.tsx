import React, { useState, ReactNode } from "react"

import { Attributes } from "domains/chart/utils/transformDataAttributes"
import { ChartMetadata } from "domains/chart/chart-types"

import { List, SimpleListItem } from "@rmwc/list"
import { MenuSurface, MenuSurfaceAnchor } from "@rmwc/menu"

import * as S from "./styled"

interface DropdownMenuCallbackProps {
  attributes: Attributes,
  chartMetadata: ChartMetadata,
  chartID: string,
}

export type DropdownMenu = {
  icon: ReactNode,
  label: string,
  onClick: (dropdownMenuCallbackProps: DropdownMenuCallbackProps) => void,
}[]

interface Props {
  attributes: Attributes
  chartID: string
  chartMetadata: ChartMetadata
  dropdownMenu: DropdownMenu
}

export const ChartDropdown = ({
  attributes,
  chartID,
  chartMetadata,
  dropdownMenu,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <S.DotsBtn
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
                  onClick({ attributes, chartMetadata, chartID })
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
