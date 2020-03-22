/* eslint-disable react/jsx-props-no-spreading */
import React from "react"
import { UINotification } from "./ui-notification"
import {
  ErrorContainer,
  ErrorIcon,
} from "./styled"

interface NotificationProps {
  header?: string
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  text?: React.ReactNode
  className?: string
  renderContent?: (props: NotificationProps) => React.ReactNode | React.ReactNodeArray | null
  success?: boolean
  error?: boolean
}

const DefaultIcon = () => (
  <ErrorContainer>
    <ErrorIcon name="error" size="large" />
  </ErrorContainer>
)

export const ErrorNotification = (props: NotificationProps) => (
  <UINotification error leftContent={<DefaultIcon />} {...props} />
)

export const createErrorNotification = ({
  errorMessage,
  errorTitle,
  ...props
}: any) => (
  <ErrorNotification
    text={errorMessage}
    header={errorTitle}
    {...props}
  />
)

// always present with closeButton={false} for react-toastify container
// or specific toast
interface ToastifyProps {
  closeToast?: () => void
}
