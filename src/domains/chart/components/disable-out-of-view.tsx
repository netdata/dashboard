import React, { useLayoutEffect, useRef, useState } from "react"
import { useDebounce, useIntersection } from "react-use"
import { forEachObjIndexed, pathOr } from "ramda"

import { useSelector } from "store/redux-separate-context"
import { isPrintMode } from "domains/dashboard/utils/parse-url"
import { selectDestroyOnHide, selectIsAsyncOnScroll } from "domains/global/selectors"
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


  const destroyOnHide = useSelector(selectDestroyOnHide)

  const portalNodeRef = useRef(portalNode)
  const intersection = useIntersection(portalNodeRef, {
    root: null,
    rootMargin: "0px",
    threshold: undefined,
  })


  // todo hook to scroll (observe on visible items) instead of changes in intersectionRatio
  // because intersectinnRatio maxes out on 1.0 when element is fully visible
  const isAsyncOnScroll = useSelector(selectIsAsyncOnScroll)

  const intersectionRatio = intersection ? intersection.intersectionRatio : 0
  const shouldUseDebounce = isAsyncOnScroll

  // aka "should hide because of intersection observer"
  const shouldHideIntersection = pathOr(0, ["intersectionRatio"], intersection) === 0

  // "should hide because of debounced scroll handler"
  const [shouldHideDebounced, setShouldHideDebounced] = useState(shouldHideIntersection)
  useDebounce(
    () => {
      if (!shouldUseDebounce) {
        return
      }
      // start rendering, when intersectionRatio is not 0 and it hasn't changed for 1500 ms
      setShouldHideDebounced(intersectionRatio === 0)
    },
    1500,
    [intersectionRatio],
  )
  const shouldHide = shouldUseDebounce ? shouldHideDebounced : shouldHideIntersection


  const [clonedChildren, setClonedChildren] = useState<Element[]>()

  if (isPrintMode) {
    // we should show everything in this case
    return children
  }

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
