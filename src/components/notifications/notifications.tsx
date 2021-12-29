import React from "react"
import { Icon } from "@netdata/netdata-ui"
import { toast } from "react-toastify"

import { createUINotification } from "components/ui-notification"

import * as S from "./styled"

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
    error: true,
    leftContent: (
      <S.NodeIconContainer>
        <Icon name="gear" size="large" color="error" />
      </S.NodeIconContainer>
    ),
  })
  toast.error(notificationComponent, toastOptions)
}

export const showCloudConnectionProblemNotification = () => {
  const uiNotification = {
    header: "Connection Problem",
    text: (
      <S.NotificationLink
        href="https://learn.netdata.cloud/docs/agent/packaging/installer#automatic-one-line-installation-script"
        target="_blank"
      >
        To access Cloud install again your agent via the kickstart script
      </S.NotificationLink>
    ),
  }
  const notificationComponent = createUINotification({
    ...uiNotification,
    error: true,
    leftContent: (
      <S.NodeIconContainer>
        <Icon name="gear" size="large" color="error" />
      </S.NodeIconContainer>
    ),
  })
  toast.error(notificationComponent, toastOptions)
}
