import { Text, NavigationTab, Icon } from "@netdata/netdata-ui"
import React from "react"

const CloudTab = ({ label, active, showBorderLeft, icon, onActivate }) => {
  const handleOnActivate = () => {
    if (active) return
    if (onActivate) onActivate()
  }
  return (
    <NavigationTab
      onActivate={handleOnActivate}
      icon={<Icon name={icon} size="small" />}
      fixed
      closable={false}
      showBorderLeft={showBorderLeft}
      active={active}
    >
      <Text>{label}</Text>
    </NavigationTab>
  )
}

export default CloudTab
