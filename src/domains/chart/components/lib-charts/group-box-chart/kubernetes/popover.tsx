/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { useState } from "react"
import { Flex, DropContainer } from "@netdata/netdata-ui"
import Separator from "./separator"
import Header from "./header"
import Tabs from "./tabs"
import Metrics from "./metrics"
import Context from "./context"
import List from "./list"

const Container = (props) => (
  <DropContainer
    background={["transparent", "popover"]}
    padding={[2, 4]}
    width="322px"
    height="422px"
    {...props}
  />
)

const TabsContainer = ({ label, value, onChange, children }) => (
  <Flex height="100%" column>
    <Header>{label}</Header>
    <Tabs value={value} onChange={onChange} margin={[4, 0, 0, 0]} />
    <Separator />
    <Flex gap={3} overflow={{ vertical: "auto", horizontal: "hidden" }} margin={[4, 0, 0, 0]}>
      {children}
    </Flex>
  </Flex>
)

const Popover = ({
  title,
  groupLabel,
  postGroupLabel,
  chartLabels,
  attributes,
  viewBefore,
  viewAfter,
  onNodeClick,
  ...rest
}) => {
  const [view, setView] = useState("context")

  const isLabelView = view !== "context" && view !== "metrics"

  const { onNodeClick } = attributes

  return (
    <Container data-testid="k8sPopover" {...rest}>
      {isLabelView && (
        <List
          labelId={view}
          items={chartLabels[view]}
          attributes={attributes}
          onBack={() => setView("context")}
          onItemClick={view === "k8s_node_name" && onNodeClick}
        />
      )}
      {!isLabelView && (
        <TabsContainer label={title} value={view} onChange={setView}>
          {view === "context" && (
            <Context chartLabels={chartLabels} onExpand={setView} onNodeClick={onNodeClick} />
          )}
          {view === "metrics" && (
            <Metrics
              groupLabel={groupLabel}
              postGroupLabel={postGroupLabel}
              attributes={attributes}
              viewAfter={viewAfter}
              viewBefore={viewBefore}
            />
          )}
        </TabsContainer>
      )}
    </Container>
  )
}

export default Popover
