import { Text } from "@netdata/netdata-ui"
import Anchor from "@/src/components/anchor"
import React from "react"

const TabsContentText = ({ children }) => <Text fontSize="16px">{children}</Text>

export const TabsContent = {
  Home: {
    id: "Home",
    label: "Home",
    header: "Home",
    text: () => (
      <TabsContentText>
        The Home view in Netdata cloud provides summarized relevant information in an easily
        digestible display. You can see information about your nodes, data collection and retention
        stats, alerts, users and dashboards.
      </TabsContentText>
    ),
    icon: "room_home",
    image: "images/home.png",
  },
  nodeView: {
    id: "nodeView",
    label: "Node View",
    header: "Node View",
    text: () => (
      <>
        <TabsContentText>
          The single node view you are currently using will of course be available on Netdata Cloud
          as well. In addition, the charts and visualization on Netdata Cloud will be more flexible
          and powerful for troubleshooting than what is available on the agent.
        </TabsContentText>
        <TabsContentText>
          Netdata Cloud also comes with the Metric Correlations feature that lets you quickly find
          metrics and charts related to a particular window of interest that you want to explore
          further. By displaying the standard Netdata dashboard, filtered to show only charts that
          are relevant to the window of interest, you can get to the root cause sooner.
        </TabsContentText>
      </>
    ),
    icon: "nodes_hollow",
    image: "images/nodeView.png",
  },
  Overview: {
    id: "Overview",
    label: "Overview",
    header: "Overview",
    text: () => (
      <>
        <TabsContentText>
          The Overview tab is a great way to monitor your infrastructure using Netdata Cloud. While
          the interface might look similar to local dashboards served by an Agent, or even the
          single-node dashboards in Netdata Cloud, Overview uses composite charts. These charts
          display real-time aggregated metrics from all the nodes (or a filtered selection) in a
          given War Room.
        </TabsContentText>
        <TabsContentText>
          With Overview's composite charts, you can see your infrastructure from a single pane of
          glass, discover trends or anomalies, then drill down by grouping metrics by node and
          jumping to single-node dashboards for root cause analysis.
        </TabsContentText>
        <TabsContentText>
          Here's an example of a composite chart visualizing Disk I/O bandwidth from 5 different
          nodes in one chart.
        </TabsContentText>
      </>
    ),
    icon: "room_overview",
    image: "images/overview.png",
  },
  Nodes: {
    id: "Nodes",
    label: "Nodes",
    header: "Nodes",
    text: () => (
      <TabsContentText>
        The Nodes view in Netdata Cloud lets you see and customize key metrics from any number of
        Agent-monitored nodes and seamlessly navigate to any node's dashboard for troubleshooting
        performance issues or anomalies using Netdata's highly-granular metrics.
      </TabsContentText>
    ),
    icon: "nodes_hollow",
    image: "images/nodes.jpg",
  },
  Dashboards: {
    id: "Dashboards",
    label: "Dashboards",
    header: "Dashboards",
    text: () => (
      <TabsContentText>
        With Netdata Cloud, you can build new dashboards that target your infrastructure's unique
        needs. Put key metrics from any number of distributed systems in one place for a bird's eye
        view of your infrastructure.
      </TabsContentText>
    ),
    icon: "dashboard",
    image: "images/dashboards.png",
  },
  Alerts: {
    id: "Alerts",
    label: "Alerts",
    header: "Alerts",
    text: () => (
      <TabsContentText>
        The Alerts view gives you a high level of availability and performance information for every
        node you're monitoring with Netdata Cloud. It also offers an easy way to drill down into any
        particular alert by taking the user to the dedicated alert view from where the user can run
        metrics correlation or take further troubleshooting steps.
      </TabsContentText>
    ),
    icon: "alarm",
    image: "images/alerts.jpg",
  },
  Anomalies: {
    id: "Anomalies",
    label: "Anomalies",
    header: "Anomaies",
    text: () => (
      <TabsContentText>
        The Anomalies view on Netdata Cloud lets you quickly surface potentially anomalous metrics
        and charts related to a particular highlight window of interest using Anomaly Advisor.
        Anomalies are detected using per metric unsupervised machine learning running at the edge!
      </TabsContentText>
    ),
    icon: "anomaliesLens",
    video:
      "https://user-images.githubusercontent.com/24860547/165943403-1acb9759-7446-4704-8955-c566d04ad7ab.mp4",
  },
  Pricing: {
    id: "Pricing",
    label: "Pricing",
    header: "Pricing",
    text: () => (
      <TabsContentText>
        Netdata Cloud’s distributed architecture—with processing occurring at the individual
        nodes—enables us to add any number of users at marginal cost. Couple this with our upcoming
        paid plan with added functionality for enterprise customers, and it means we can commit to
        providing our current functionality for free, always.
      </TabsContentText>
    ),
    image: "images/pricing.png",
    icon: "pricing",
  },
  Privacy: {
    id: "Privacy",
    label: "Privacy",
    header: "Privacy",
    text: () => (
      <>
        <TabsContentText>
          Data privacy is very important to us. We firmly believe that your data belongs to you.
          This is why we don't store any metric data in Netdata Cloud.
        </TabsContentText>
        <TabsContentText>
          Your local installations of the Netdata Agent form the basis for the Netdata Cloud. All
          the data that you see in the web browser when using Netdata Cloud, is actually streamed
          directly from the Netdata Agent to the Netdata Cloud dashboard. The data passes through
          our systems, but it isn't stored. You can learn more about{" "}
          <Anchor
            target="_blank"
            rel="noopener noreferrer"
            href="https://learn.netdata.cloud/docs/agent/netdata-security"
          >
            the Agent's security design
          </Anchor>{" "}
          design in the Agent documentation.
        </TabsContentText>
        <TabsContentText>
          However, to be able to offer the stunning visualizations and advanced functionality of
          Netdata Cloud, it does store a limited number of metadata. This metadata is ONLY available
          to Netdata and NEVER to any 3rd parties. You can learn more about what metadata is stored
          in Netdata cloud in our
          <Anchor
            target="_blank"
            rel="noopener noreferrer"
            href="https://learn.netdata.cloud/docs/cloud/data-privacy"
          >
            {" "}
            documentation
          </Anchor>
        </TabsContentText>
      </>
    ),
    icon: "privacy",
  },
}
