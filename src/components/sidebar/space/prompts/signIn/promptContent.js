import React from "react"
import { TextSmall } from "@netdata/netdata-ui"

const promptContent = {
  signIn: {
    title: "Welcome back!",
    content: [
      <TextSmall key="1" color="bright">
        Sign-in again to enjoy the benefits of Netdata Cloud{" "}
      </TextSmall>,
    ],
  },
  signUp: {
    title: "Welcome to Netdata Cloud!",
    content: [
      <TextSmall key="1" color="bright">
        <TextSmall strong color="bright">
          A single place
        </TextSmall>{" "}
        for all your nodes
      </TextSmall>,
      <TextSmall key="2" color="bright">
        <TextSmall strong color="bright">
          Multi-node dashboards
        </TextSmall>{" "}
        out of the box
      </TextSmall>,
      <TextSmall key="3" color="bright">
        <TextSmall strong color="bright">
          Custom dashboards
        </TextSmall>{" "}
        for you to create and edit online
      </TextSmall>,
      <TextSmall key="4" color="bright">
        <TextSmall strong color="bright">
          Metric Correlations
        </TextSmall>{" "}
        to find the root cause of anything
      </TextSmall>,
      <TextSmall key="5" color="bright">
        <TextSmall strong color="bright">
          Centrally dispatched notifications
        </TextSmall>{" "}
        for alarms of all your nodes
      </TextSmall>,
      <TextSmall key="6" color="bright">
        And... It is free, forever!
      </TextSmall>,
    ],
  },
}

export default promptContent
