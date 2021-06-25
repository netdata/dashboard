import React from "react"
import { Button, News as AgentNews } from "@netdata/netdata-ui"

const News = () => {
  return (
    <AgentNews app="agent">
      {({ toggle, upToDate }) => (
        <Button
          themeType="dark"
          name="news"
          title="News & Features"
          icon="insights"
          flavour="borderless"
          neutral={upToDate}
          warning={!upToDate}
          onClick={toggle}
        />
      )}
    </AgentNews>
  )
}

export default News
