export type NodeStatus = "Connected" | "Not_Connected"
export enum UserStatus {
  Logged_In = "Logged_In",
  Logged_Out = "Logged_Out",
  Not_Signed_Up = "Not_Signed_Up",
}
export type CloudConnectionProps = { userStatus: UserStatus; nodeStatus: NodeStatus; date?: string }

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
