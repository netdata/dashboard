import React from "react"
import {
  Container,
  SideContent,
  ContentContainer,
  HeaderText,
  ContentText,
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

export const UINotification = (props: NotificationProps) => {
  const {
    header, text, leftContent, rightContent, renderContent, success, error,
  } = props
  return (
    <Container>
      {leftContent && <SideContent>{leftContent}</SideContent>}
      <ContentContainer>
        {header && (
          <HeaderText success={success} error={error}>
            {header}
          </HeaderText>
        )}
        {text && (
          <ContentText success={success} error={error}>
            {text}
          </ContentText>
        )}
        {renderContent && renderContent(props)}
      </ContentContainer>
      {rightContent && <SideContent right>{rightContent}</SideContent>}
    </Container>
  )
}

// for usage in non-jsx contexts
export const createUINotification = (props: NotificationProps) => <UINotification {...props} />
