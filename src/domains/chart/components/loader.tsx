import React from "react"

import { Icon } from "components/icon"

interface Props {
  containerNode: HTMLElement
  hasEmptyData: boolean
}

export const Loader = ({
  containerNode,
  hasEmptyData,
}: Props) => {
  // below is 90% of original logic.
  // since it rerenders when IntersectionObserver turns the chart back on,
  // it's not that important to detect screen height and container sizes changes
  const screenHeight = window.screen.height

  // normally we want a font size, as tall as the element
  let h = containerNode.clientHeight

  // but give it some air, 20% let's say, or 5 pixels min
  const lost = Math.max(h * 0.2, 5)
  h -= lost

  // center the text, vertically
  let paddingTop = (lost - 5) / 2

  // but check the width too
  // it should fit 10 characters in it
  const w = containerNode.clientWidth / 10
  if (h > w) {
    paddingTop += (h - w) / 2
    h = w
  }

  // and don't make it too huge
  // 5% of the screen size is good
  if (h > screenHeight / 20) {
    paddingTop += (h - (screenHeight / 20)) / 2
    h = screenHeight / 20
  }

  const label = hasEmptyData ? " empty" : " netdata"
  const iconType = hasEmptyData ? "noData" : "loading"

  return (
    <div
      className="netdata-message icon"
      style={{
        fontSize: h,
        paddingTop,
      }}
    >
      <Icon iconType={iconType} />
      {label}
    </div>
  )
}
