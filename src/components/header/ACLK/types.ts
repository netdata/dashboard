import { UserStatus, NodeLiveness } from "@/src/domains/dashboard/components/migration-modal"
import React from "react"

export type CloudConnectionProps = {
  userStatus: UserStatus
  nodeStatus: NodeLiveness
  date?: string
}

export type MigrationModalActions = {
  text: string
}

export type ConnectionModalStatusContent = {
  title: string
  text: {
    header: (props?: any) => React.ReactElement
    bullets?: Array<string | ((props?: any) => React.ReactNode)>
    footer?: () => React.ReactElement
  }
  CTA1: MigrationModalActions
}
