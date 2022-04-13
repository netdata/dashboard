import React, { memo, useMemo, useRef, useEffect } from "react"
import { throttle } from "throttle-debounce"
import { useMenuGroupIds, useContainer } from "@/src/domains/charts"
import CellMeasurer, { CellMeasurerCache } from "react-virtualized/dist/commonjs/CellMeasurer"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"
import VirtualizedList from "react-virtualized/dist/commonjs/List"
import CellMeasurerWrapper from "./cellMeasurerWrapper"
import useMakeList from "./useMakeList"

const makeThrottleScroll = () =>
  throttle(400, (container, onActiveSubMenuId, onActiveMenuGroupId) => {
    if (!container) return

    const { top: containerTop } = container.getBoundingClientRect()

    const firstVisibleElement = Array.from(
      container.querySelectorAll("[data-submenuid], [data-menuid]")
    ).find(el => el.getBoundingClientRect().top - containerTop > 0)

    if (!firstVisibleElement) return

    const menuGroupId = firstVisibleElement.getAttribute("data-menuid")
    if (menuGroupId) {
      onActiveSubMenuId("")
      onActiveMenuGroupId(menuGroupId)
      return
    }

    const chartElement = Array.from(container.querySelectorAll("[data-chartid]")).find(
      el => el.getBoundingClientRect().top - containerTop > 0
    )
    if (chartElement) {
      const subMenuId = chartElement.closest("[data-submenuid]").getAttribute("data-submenuid")
      onActiveSubMenuId(subMenuId)
      return
    }

    const subMenuId = firstVisibleElement.getAttribute("data-submenuid")
    onActiveSubMenuId(subMenuId)
  })

const List = ({ onActiveMenuGroupId, onActiveSubMenuId, getComponent }) => {
  const container = useContainer()
  const ids = useMenuGroupIds()

  const ref = useRef()
  const measures = useRef({})
  const cache = useMemo(() => new CellMeasurerCache({ defaultHeight: 1000, fixedWidth: true }), [])
  const widthRef = useRef(0)

  const rowRenderMeasurer = useMemo(
    () => ({ index, parent, key, style, isScrolling, isVisible }) => {
      const id = ids[index]
      return (
        <CellMeasurer
          cache={cache}
          columnIndex={0}
          key={key}
          parent={parent}
          rowIndex={index}
          width={widthRef.current}
        >
          {({ measure }) => {
            measures.current[id] = measure
            const Component = getComponent(id, index)

            return (
              <CellMeasurerWrapper style={style} index={index} id={id} measure={measure}>
                <Component id={id} isVisible={isVisible} isScrolling={isScrolling} />
              </CellMeasurerWrapper>
            )
          }}
        </CellMeasurer>
      )
    },
    [ids.length]
  )

  const list = useMakeList({ ref, measures, cache })
  const throttleScrollRef = useRef()

  const onScroll = useMemo(() => {
    if (throttleScrollRef.current) throttleScrollRef.current.cancel()
    throttleScrollRef.current = makeThrottleScroll()

    return () => throttleScrollRef.current(container, onActiveSubMenuId, onActiveMenuGroupId)
  }, [container, onActiveSubMenuId, onActiveMenuGroupId])

  useEffect(() => {
    const requestId = requestAnimationFrame(onScroll)
    return () => cancelAnimationFrame(requestId)
  }, [])

  return (
    <AutoSizer>
      {({ height, width }) => {
        if (widthRef.current && Math.abs(widthRef.current - width) > 15) {
          list.resizeAll()
        }
        widthRef.current = width

        return (
          <VirtualizedList
            ref={ref}
            deferredMeasurementCache={cache}
            height={height}
            overscanRowCount={1}
            rowCount={ids.length}
            rowHeight={cache.rowHeight}
            rowRenderer={rowRenderMeasurer}
            width={width}
            onScroll={onScroll}
            tabIndex={null}
            scrollToAlignment="start"
          />
        )
      }}
    </AutoSizer>
  )
}

export default memo(List)
