/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { useState } from "react"
import { Flex } from "@netdata/netdata-ui"
import Popover, { Separator, Header } from "./popover"
import Tabs from "./tabs"
import Metrics from "./metrics"
import Context from "./context"
import { labelIds } from "./labels"
import List from "./list"

const TabsContainer = ({ label, value, onChange, children }) => {
  return (
    <Flex height="100%" column>
      <Header>{label}</Header>
      <Tabs value={value} onChange={onChange} margin={[4, 0, 0, 0]} />
      <Separator />
      <Flex gap={3} overflow={{ vertical: "auto", horizontal: "hidden" }} margin={[4, 0, 0, 0]}>
        {children}
      </Flex>
    </Flex>
  )
}

const GroupPopover = ({ label, attributes, chartMetadata, viewBefore, viewAfter, ...rest }) => {
  const [view, setView] = useState("context")

  const isLabelView = labelIds.includes(view)

  return (
    <Popover {...rest}>
      {isLabelView && (
        <List
          labelId={view}
          chartMetadata={chartMetadata}
          attributes={attributes}
          onBack={() => setView("context")}
        />
      )}
      {!isLabelView && (
        <TabsContainer label={label} value={view} onChange={setView}>
          {view === "context" && <Context attributes={attributes} onExpand={setView} />}
          {view === "metrics" && (
            <Metrics
              label={label}
              attributes={attributes}
              viewAfter={viewAfter}
              viewBefore={viewBefore}
            />
          )}
        </TabsContainer>
      )}
    </Popover>
  )
}

export default GroupPopover
