import React, { memo, useMemo, useRef, useEffect } from "react"
import { throttle } from "throttle-debounce"
import { useMenuGroupIds, useContainer, useDispatchList } from "@/src/domains/charts/providers"
import CellMeasurer, { CellMeasurerCache } from "react-virtualized/dist/commonjs/CellMeasurer"
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer"
import List from "react-virtualized/dist/commonjs/List"
import CellMeasurerWrapper from "./cellMeasurerWrapper"
import retry from "./retry"

const Virtualized = ({ onActiveMenuGroupId, onActiveSubMenuId, getComponent }) => {
  const container = useContainer()
  const ids = useMenuGroupIds()

  const ref = useRef()
  const measures = useRef({})
  const cache = useMemo(() => new CellMeasurerCache({ defaultHeight: 1000, fixedWidth: true }), [])
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
          const Component = getComponent(id, index)

          return (
            <CellMeasurerWrapper style={style} index={index} id={id} measure={measure}>
              <Component id={id} />
            </CellMeasurerWrapper>
          )
        }}
      </CellMeasurer>
    )
  }

  const instance = useMemo(() => {
    const goToMenuGroup = async id => {
      await retry(() => {
        const targetIndex = ids.indexOf(id)
        if (targetIndex !== -1) return ref.current.scrollToRow(targetIndex)
      }, 5)

      await retry(() => {
        const target = container.querySelector(`[data-menuid="${id}"]`)
        if (target) target.scrollIntoView()
      }, 5)
    }

    const goToSubMenu = id => {
      const target = container.querySelector(`[data-submenuid="${id}"]`)
      if (target) target.scrollIntoView()
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

    return { goToMenuGroup, goToSubMenu, measure, resize, resizeAll }
  }, [container, ids])

  const dispatchList = useDispatchList()

  useEffect(() => {
    dispatchList(instance)
  }, [instance])

  const onScroll = useMemo(
    () =>
      throttle(400, () => {
        if (!container) return

        const { top: containerTop } = container.getBoundingClientRect()

        const firstVisibleElement = Array.from(
          document.querySelectorAll("[data-submenuid],[data-menuid]")
        ).find(el => el.getBoundingClientRect().top - containerTop > 0)

        if (!firstVisibleElement) return

        const menuGroupId = firstVisibleElement.getAttribute("data-menuid")
        if (menuGroupId) {
          onActiveSubMenuId("")
          onActiveMenuGroupId(menuGroupId)
          return
        }

        const subMenuId = firstVisibleElement.getAttribute("data-submenuid")
        onActiveSubMenuId(subMenuId)
      }),
    [container]
  )

  useEffect(() => {
    const requestId = requestAnimationFrame(onScroll)
    return () => cancelAnimationFrame(requestId)
  }, [])

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
            onScroll={onScroll}
            tabIndex={null}
          />
        )
      }}
    </AutoSizer>
  )
}

export default memo(Virtualized)
