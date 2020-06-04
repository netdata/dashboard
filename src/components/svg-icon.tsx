import React from "react"

interface Props {
  icon: {
    id: string
    viewBox: string
  }
  height?: number
  width?: number
}

export const SvgIcon = ({ icon, height, width }: Props) => (
  <svg viewBox={icon.viewBox} style={{ height, width }}>
    <use xlinkHref={`#${icon.id}`} />
  </svg>
)
