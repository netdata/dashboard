import React from "react"
import { Icon } from "@netdata/netdata-ui"
import { toast } from "react-toastify"

import { createUINotification } from "components/ui-notification"

import { NodeIconContainer } from "./styled"

export const toastOptions = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 10000,
  pauseOnFocusLoss: false,
}

export const showCloudInstallationProblemNotification = () => {
  const uiNotification = {
    header: "Installation error",
    text: "The installer could not prepare the required dependencies to enable Netdata Cloud"
      + " functionality",
  }
  const notificationComponent = createUINotification({
    ...uiNotification,
    success: false,
    leftContent: (
      <NodeIconContainer>
        <Icon name="gear" size="large" />
      </NodeIconContainer>
    ),
  })
  toast.error(notificationComponent, toastOptions)
}

export const showCloudConnectionProblemNotification = () => {
  const uiNotification = {
    header: "Connection Problem",
    text: "This agent cannot connect to Netdata Cloud. Please talk to system's administrator for"
      + " more information.",
  }
  const notificationComponent = createUINotification({
    ...uiNotification,
    success: false,
    leftContent: (
      <NodeIconContainer>
        <Icon name="gear" size="large" />
      </NodeIconContainer>
    ),
  })
  toast.error(notificationComponent, toastOptions)
}
