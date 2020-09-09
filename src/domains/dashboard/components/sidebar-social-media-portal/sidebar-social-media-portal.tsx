import React, { useRef } from "react"
import { createPortal } from "react-dom"

interface Props {
  children: React.ReactNode
}
export const SidebarSocialMediaPortal = ({
  children,
}: Props) => {
  const element = useRef(document.querySelector("#sidebar-end-portal-container"))
  return createPortal(children, element.current!)
}
