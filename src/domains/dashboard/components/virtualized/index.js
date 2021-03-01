import React, { memo, useMemo, useRef, useEffect } from "react"
import { throttle } from "throttle-debounce"
import {
  useMenuIds,
  useActiveMenu,
  useContainer,
  useDispatchList,
} from "@/src/domains/charts/providers"
import CellMeasurer, { CellMeasurerCache } from "react-virtualized/dist/commonjs/CellMeasurer"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"
import List from "react-virtualized/dist/commonjs/List"

const retry = (callback, times) => {
  return new Promise(resolve => {
    const innerRetry = remaining => {
      if (remaining === 0) return resolve()
      callback()
      requestAnimationFrame(() => innerRetry(--remaining))
    }

    innerRetry(times)
  })
}

const virtualized = ({ onActiveMenu, onActiveSubMenu, rowRender }) => {
  const { menuId: activeMenuId, subMenuId: activeSubMenuId } = useActiveMenu()
  const container = useContainer()
  const ids = useMenuIds()

  const ref = useRef()
  const measures = useRef({})
  const cache = useMemo(() => new CellMeasurerCache({ defaultHeight: 1000, fixedWidth: true }), [])
  const startIndexRef = useRef(null)
  const widthRef = useRef(0)

  const rowRenderMeasurer = ({ index, parent, key, style }) => {
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
          return rowRender({ style, index, id, measure })
        }}
      </CellMeasurer>
    )
  }

  const instance = useMemo(() => {
    const goToGroupMenu = id => {
      const targetIndex = ids.indexOf(id)
      if (targetIndex === -1) return Promise.reject()

      return retry(() => ref.current.scrollToRow(targetIndex), 5).then(() =>
        retry(() => {
          const target = container.querySelector(`[data-menuid="${id}"]`)
          if (target) target.scrollIntoView()
        }, 5)
      )
    }

    const goToSubMenu = id => {
      goToGroupMenu()
      const target = container.querySelector(`[data-submenuid="${id}"]`)
      if (target) {
        target.scrollIntoView()
      }
    }

    const measure = id => measures.current[id]()

    const resize = id => {
      measure(id)
      ref.current.forceUpdateGrid()
    }

    const resizeAll = () => {
      cache.clearAll()
      ref.current.forceUpdateGrid()
    }

    return { goToGroupMenu, goToSubMenu, measure, resize, resizeAll }
  }, [container, ids])

  const dispatchList = useDispatchList()

  useEffect(() => {
    dispatchList(instance)
  }, [instance])

  const onScroll = useMemo(
    () =>
      throttle(400, () => {
        if (!container) return

        const menuGroupElement = container.querySelector(`[data-menuid="${startIndexRef.current}"]`)
        if (!menuGroupElement) return

        const currentNode = Array.from(menuGroupElement.querySelectorAll("[data-submenuid]")).find(
          el => el.getBoundingClientRect().top > 0
        )

        if (!currentNode) return

        const nextSubMenuId = currentNode.getAttribute("data-submenuid")
        if (activeSubMenuId !== nextSubMenuId) {
          onActiveSubMenu(nextSubMenuId)
        }
      }),
    [container, activeSubMenuId]
  )

  const onRowsRendered = ({ startIndex }) => {
    const nextActiveMenuId = ids[startIndex]
    if (nextActiveMenuId !== activeMenuId) {
      startIndexRef.current = nextActiveMenuId
      onActiveMenu(nextActiveMenuId)
    }
  }

  return (
    <AutoSizer>
      {({ height, width }) => {
        if (widthRef.current && widthRef.current !== width) {
          instance.resizeAll()
        }
        widthRef.current = width

        return (
          <List
            ref={ref}
            deferredMeasurementCache={cache}
            height={height}
            overscanRowCount={1}
            rowCount={ids.length}
            rowHeight={cache.rowHeight}
            rowRenderer={rowRenderMeasurer}
            width={width}
            onRowsRendered={onRowsRendered}
            onScroll={onScroll}
            tabIndex={null}
          />
        )
      }}
    </AutoSizer>
  )
}

export default memo(virtualized)
