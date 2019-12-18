import React, { useLayoutEffect, useRef, useState } from "react"
import { useIntersection } from "react-use"
import { forEachObjIndexed, pathOr } from "ramda"

import { getPortalNodeStyles } from "domains/chart/utils/get-portal-node-styles"
import { Attributes } from "domains/chart/utils/transformDataAttributes"
import { chartLibrariesSettings } from "domains/chart/utils/chartLibrariesSettings"

import { InvisibleSearchableText } from "./invisible-searchable-text"

const cloneWithCanvas = (element: Element) => {
  const cloned = element.cloneNode(true) as Element
  const clonedCanvases = cloned.querySelectorAll("canvas")

  element.querySelectorAll("canvas")
    .forEach((oldCanvas, index) => {
      const newCanvas = clonedCanvases[index]
      const context = newCanvas.getContext("2d")

      newCanvas.width = oldCanvas.width
      newCanvas.height = oldCanvas.height

      if (context) {
        context.drawImage(oldCanvas, 0, 0)
      }
    })
  return cloned
}

interface Props {
  attributes: Attributes
  children: any
  portalNode: HTMLElement
}
export const DisableOutOfView = ({
  attributes,
  children,
  portalNode,
}: Props) => {
  /* separate functionality - adding custom styles to portalNode */
  const chartSettings = chartLibrariesSettings[attributes.chartLibrary]
  const [hasPortalNodeBeenStyled, setHasPortalNodeBeenStyled] = useState<boolean>(false)
  // todo omit this for Cloud
  useLayoutEffect(() => {
    if (hasPortalNodeBeenStyled) {
      return
    }
    const styles = getPortalNodeStyles(attributes, chartSettings)
    forEachObjIndexed((value, styleName) => {
      if (value) {
        portalNode.style.setProperty(styleName, value)
      }
    }, styles)
    // eslint-disable-next-line no-param-reassign
    portalNode.className = chartSettings.containerClass(attributes)
    setHasPortalNodeBeenStyled(true)
  }, [attributes, chartSettings, hasPortalNodeBeenStyled, portalNode, setHasPortalNodeBeenStyled])
  /* end of "adding custom styles to portalNode" */


  const destroyOnHide = window.NETDATA.options.current.destroy_on_hide
  const portalNodeRef = useRef(portalNode)
  const intersection = useIntersection(portalNodeRef, {
    root: null,
    // rootMargin: "-150px", // for demoing
    rootMargin: "0px",
    threshold: undefined,
  })
  // should be throttled when NETDATA.options.current.async_on_scroll is on
  const shouldHide = pathOr(0, ["intersectionRatio"], intersection) === 0

  const [clonedChildren, setClonedChildren] = useState<Element[]>()

  if (shouldHide) {
    if (destroyOnHide) {
      return (
        <InvisibleSearchableText attributes={attributes} />
      )
    }

    if (!clonedChildren) {
      const newClonedChildren = Array.from(portalNode.children)
        .map((child) => cloneWithCanvas(child))
      setClonedChildren(newClonedChildren)
    }

    return (
      <>
        <InvisibleSearchableText attributes={attributes} />
        <div
          // style={{ background: "yellow", height: "100%" }} // demo styles
          ref={(nodeElement) => {
            if (nodeElement && clonedChildren) {
              clonedChildren.forEach((child: Element) => {
                nodeElement.appendChild(child)
              })
            }
          }}
        />
      </>
    )
  }

  if (!destroyOnHide && clonedChildren) {
    setClonedChildren(undefined)
  }

  return children
}
