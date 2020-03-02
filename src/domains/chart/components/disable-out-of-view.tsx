import React, {
  useEffect, useLayoutEffect, useState,
} from "react"
import { useDebounce } from "react-use"
import { forEachObjIndexed } from "ramda"

import { useDispatch, useSelector } from "store/redux-separate-context"
import { isPrintMode } from "domains/dashboard/utils/parse-url"
import { selectDestroyOnHide, selectIsAsyncOnScroll } from "domains/global/selectors"
import { getPortalNodeStyles } from "domains/chart/utils/get-portal-node-styles"
import { Attributes } from "domains/chart/utils/transformDataAttributes"
import { chartLibrariesSettings } from "domains/chart/utils/chartLibrariesSettings"
import { useCommonIntersection } from "hooks/use-common-intersection"

import { clearChartStateAction } from "../actions"

import { InvisibleSearchableText } from "./invisible-searchable-text"

const SCROLL_DEBOUNCE_ASYNC = 750
const SCROLL_DEBOUNCE_SYNC = 100

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
  chartUuid: string
  children: any
  portalNode: HTMLElement
}
export const DisableOutOfView = ({
  attributes,
  chartUuid,
  children,
  portalNode,
}: Props) => {
  /* when unmounting, clear redux state for this chart */
  const dispatch = useDispatch()
  useEffect(() => { // eslint-disable-line arrow-body-style
    return () => {
      dispatch(clearChartStateAction({ id: chartUuid }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


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
  const isVisibleIntersection = useCommonIntersection(portalNode)

  // todo hook to scroll (observe on visible items) instead of changes in intersectionRatio
  // because intersectinnRatio maxes out on 1.0 when element is fully visible
  const isAsyncOnScroll = useSelector(selectIsAsyncOnScroll)
  const debounceTime = isAsyncOnScroll ? SCROLL_DEBOUNCE_ASYNC : SCROLL_DEBOUNCE_SYNC

  // "should hide because of debounced scroll handler"
  const [shouldHideDebounced, setShouldHideDebounced] = useState(!isVisibleIntersection)
  useDebounce(
    () => {
      // start rendering, when intersectionRatio is not 0 and it hasn't changed for 1500 ms
      setShouldHideDebounced(!isVisibleIntersection)
    },
    debounceTime,
    [isVisibleIntersection],
  )
  // const shouldHide = shouldUseDebounce ? shouldHideDebounced : !isVisibleIntersection

  const [clonedChildren, setClonedChildren] = useState<Element[]>()

  if (isPrintMode) {
    // we should show everything in this case
    return children
  }

  if (shouldHideDebounced) {
    // todo perhaps loader should be added here to both scenarios
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
