export type NodeStatus = "Connected" | "Not_Connected"
export enum UserStatus {
  Logged_In = "Logged_In",
  Logged_Out = "Logged_Out",
  Not_Signed_Up = "Not_Signed_Up",
}
export type CloudConnectionProps = { userStatus: UserStatus; nodeStatus: NodeStatus; date?: string }
