import React, { useState, useEffect, forwardRef } from "react"
import { name2id } from "utils/name-2-id"
import { options } from "../../utils/netdata-dashboard"
import SubSection from "./subSection"

const chartsPerRow = () => (options.chartsPerRow === 0 ? 1 : options.chartsPerRow)

const DashboardCharts = forwardRef(
  (
    {
      main,
      menus,
      defaultChart,
      timeWindow,
      chartsMetadata,
      renderCustomElementForDygraph,
      onAttributesChange,
      renderBeforeCharts,
      dropdownMenu,
      host,
      metricsCorrelationMetadata,
      attributes,
      commonAttributesOverrides,
      nodeIDs,
      children,
    },
    ref
  ) => {
    const [width, setWidth] = useState(0)

    useEffect(() => {
      if (!width && ref.current) {
        setWidth(ref.current.getBoundingClientRect().width)
      }
    }, [width])

    useEffect(() => {
      if (!defaultChart) return

      const timeoutID = setTimeout(() => {
        const chartElement = document.querySelector(`#${defaultChart}`)
        if (chartElement) chartElement.scrollIntoView()
      })
      // eslint-disable-next-line consistent-return
      return () => clearTimeout(timeoutID)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // todo support print mode when it will be used in main.js
    const pcentWidth = Math.floor(100 / chartsPerRow())
    const duration =
      timeWindow ||
      Math.round((((width * pcentWidth) / 100) * chartsMetadata.update_every) / 3 / 60) * 60

    return (
      <div ref={ref} className="charts-body" role="main">
        {children}
        {!!duration &&
          main.map((menuName, menuIndex) => {
            const menu = menus[menuName]
            return (
              <div role="region" className="dashboard-section" key={menuName}>
                <div>
                  <h1 id={name2id(`menu_${menuName}`)} data-menuId={menuName}>
                    {/* eslint-disable-next-line react/no-danger */}
                    <span dangerouslySetInnerHTML={{ __html: menu.icon }} /> {menu.title}
                  </h1>
                </div>
                <SubSection
                  renderCustomElementForDygraph={renderCustomElementForDygraph}
                  onAttributesChange={onAttributesChange}
                  renderBeforeCharts={renderBeforeCharts}
                  duration={duration}
                  dropdownMenu={dropdownMenu}
                  menu={menu}
                  menuName={menuName}
                  pcentWidth={pcentWidth}
                  shouldDisplayHeadMain={menuIndex === 0}
                  host={host}
                  chartsMetadata={metricsCorrelationMetadata || chartsMetadata}
                  attributesOverrides={attributes}
                  commonAttributesOverrides={commonAttributesOverrides}
                  nodeIDs={nodeIDs}
                />
              </div>
            )
          })}
      </div>
    )
  }
)

export default DashboardCharts
