import React from "react"
import { TextSmall } from "@netdata/netdata-ui"

const promptContent = {
  signIn: {
    title: "Welcome back!",
    content: [
      <TextSmall key="1" color="black" textAlign="center">
        Sign-in again to enjoy the benefits of Netdata Cloud{" "}
      </TextSmall>,
    ],
  },
  signUp: {
    title: "Welcome to Netdata Cloud!",
    content: [
      <TextSmall key="1" color="black" textAlign="center">
        <TextSmall strong color={["black", "pure"]}>
          A single place
        </TextSmall>{" "}
        for all your nodes
      </TextSmall>,
      <TextSmall key="2" color="black" textAlign="center">
        <TextSmall strong color={["black", "pure"]}>
          Multi-node dashboards
        </TextSmall>{" "}
        out of the box
      </TextSmall>,
      <TextSmall key="3" color="black" textAlign="center">
        <TextSmall strong color={["black", "pure"]}>
          Custom dashboards
        </TextSmall>{" "}
        for you to create and edit online
      </TextSmall>,
      <TextSmall key="4" color="black" textAlign="center">
        <TextSmall strong color={["black", "pure"]}>
          Metric Correlations
        </TextSmall>{" "}
        to find the root cause of anything
      </TextSmall>,
      <TextSmall key="5" color="black" textAlign="center">
        <TextSmall strong color={["black", "pure"]}>
          Centrally dispatched notifications
        </TextSmall>{" "}
        for alarms of all your nodes
      </TextSmall>,
      <TextSmall key="6" color="black" textAlign="center">
        And... It is free, forever!
      </TextSmall>,
    ],
  },
}

export default promptContent
