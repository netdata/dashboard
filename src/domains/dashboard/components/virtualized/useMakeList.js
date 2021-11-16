import { useLayoutEffect, useMemo } from "react"
import {
  MenuGroupIdsContext,
  MenuGroupByIdContext,
  SubMenuByIdContext,
  MenuChartsAttributeById,
  useContainer,
  useDispatchList,
} from "@/src/domains/charts"
import useLatestContext from "@/src/hooks/useLatestContext"
import retry from "./retry"

export default ({ ref, measures, cache }) => {
  const container = useContainer()
  const menuGroupIdsRef = useLatestContext(MenuGroupIdsContext)
  const menuGroupByIdRef = useLatestContext(MenuGroupByIdContext)
  const subMenuByIdRef = useLatestContext(SubMenuByIdContext)
  const menuChartsAttributeByIdRef = useLatestContext(MenuChartsAttributeById)
  const dispatchList = useDispatchList()

  const list = useMemo(() => {
    const goToMenuGroup = async id => {
      await retry(() => {
        const targetIndex = menuGroupIdsRef.current.indexOf(id)
        if (targetIndex !== -1) return ref.current && ref.current.scrollToRow(targetIndex)
      }, 5)

      await retry(() => {
        const target = container.querySelector(`[data-menuid="${id}"]`)
        if (target) target.scrollIntoView()
      }, 5)
    }

    const goToSubMenu = async id => {
      await retry(() => {
        const target = container.querySelector(`[data-submenuid="${id}"]`)
        if (target) target.scrollIntoView()
      }, 5)
    }

    const goToChart = async id => {
      await retry(() => {
        const target = container.querySelector(`[data-chartid="${id}"]`)
        if (target) target.scrollIntoView()
      }, 5)
    }

    const goToLink = link => {
      const menuGroup = Object.values(menuGroupByIdRef.current).find(r => r.link === link)

      if (menuGroup) {
        return list.goToMenuGroup(menuGroup.id)
      }

      const subMenu = Object.values(subMenuByIdRef.current).find(r => r.link === link)
      if (subMenu) {
        return list.goToMenuGroup(subMenu.menuGroupId).then(() => list.goToSubMenu(subMenu.id))
      }

      const menuChart = Object.values(menuChartsAttributeByIdRef.current).find(r => r.link === link)
      if (menuChart) {
        return list
          .goToMenuGroup(menuChart.menuGroupId)
          .then(() => list.goToChart(menuChart.chartId))
      }
    }

    const measure = id => {
      try {
        measures.current[id]()
      } catch (e) {}
    }

    const resize = id => {
      if (!ref.current) return
      measure(id)
      ref.current.forceUpdateGrid()
    }

    const resizeAll = () => {
      if (!ref.current) return
      cache.clearAll()
      ref.current.forceUpdateGrid()
    }

    return { goToMenuGroup, goToSubMenu, goToChart, goToLink, measure, resize, resizeAll }
  }, [container])

  useLayoutEffect(() => {
    dispatchList(list)
  }, [list])

  return list
}
