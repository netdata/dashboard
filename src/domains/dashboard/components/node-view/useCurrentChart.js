import { useEffect, useState } from "react"
import { throttle } from "throttle-debounce"

const isSectionNodeVisible = node =>
  node.getAttribute("id").startsWith("menu") && node.getBoundingClientRect().top > 0

export default ({ ref, scrollableContainerRef, defaultChart, onChangeChart }) => {
  const [currentChart, setCurrentChart] = useState(defaultChart)
  const [activeMenuId, setActiveMenuId] = useState("")
  const [activeSubMenuId, setActiveSubMenuId] = useState("")

  useEffect(() => {
    const el = scrollableContainerRef.current
    if (!el || !ref.current) return

    const onScroll = throttle(400, () => {
      const currentNode = Array.from(ref.current.querySelectorAll("[id]")).find(
        isSectionNodeVisible
      )

      if (!currentNode) return

      const chartIdInMenu = currentNode.getAttribute("id")
      setActiveMenuId(currentNode.getAttribute("data-menuid") || "")
      setActiveSubMenuId(currentNode.getAttribute("data-submenuid") || "")

      setCurrentChart(chartIdInMenu)
      if (onChangeChart) onChangeChart(chartIdInMenu)
    })

    const requestId = requestAnimationFrame(onScroll)

    el.addEventListener("scroll", onScroll, {
      capture: false,
      passive: true,
    })
    return () => {
      el.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(requestId)
    }
  }, [scrollableContainerRef.current])

  return [currentChart, activeMenuId, activeSubMenuId]
}
