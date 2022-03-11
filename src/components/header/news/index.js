import React from "react"
import { Button, News as AgentNews } from "@netdata/netdata-ui"
import Tooltip from "@/src/components/tooltips"

const News = () => {
  return (
    <AgentNews app="agent">
      {({ toggle, upToDate }) => (
        <Tooltip content="News" align="bottom" plain>
          <Button
            data-testid="header-news-button"
            themeType="dark"
            name="news"
            icon="insights"
            flavour="borderless"
            neutral={upToDate}
            warning={!upToDate}
            onClick={toggle}
          />
        </Tooltip>
      )}
    </AgentNews>
  )
}

export default News
