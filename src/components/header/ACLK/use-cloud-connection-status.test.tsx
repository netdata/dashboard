import { renderHook } from "@testing-library/react-hooks"
import useCloudConnectionStatus, {
  makeCloudConnectionStatusInfo,
} from "./use-cloud-connection-status"
import { CloudConnectionProps, UserStatus, NodeStatus } from "./types"

describe("useCloudConnectionStatus", () => {
  it("should return correct status when node is connected and user logged in ", () => {
    const cloudConnectionStatusInfo: CloudConnectionProps = {
      userStatus: UserStatus.Logged_In,
      nodeStatus: "Connected",
      date: "Monday 22 of May",
    }

    const { result } = renderHook(() => useCloudConnectionStatus({ ...cloudConnectionStatusInfo }))

    expect(result.current.text.bullets).toHaveLength(0)
    expect(result.current.text.footer().props.children[2].props.children).toBe("Logged In")
    expect(result.current.text.header().props.children[2].props.children).toBe("Connected")
  })

  it("should return correct status when node i nots connected and user is logged out ", () => {
    const cloudConnectionStatusInfo: CloudConnectionProps = {
      userStatus: UserStatus.Logged_Out,
      nodeStatus: "Not_Connected",
      date: "Monday 22 of May",
    }

    const { result } = renderHook(() => useCloudConnectionStatus({ ...cloudConnectionStatusInfo }))

    expect(result.current.text.bullets).toHaveLength(2)
    expect(result.current.text.footer().props.children[2].props.children).toBe("Logged out")
    expect(result.current.text.header().props.children[2].props.children).toBe("Not Connected")
  })

  it("should return correct status when user is not signedup ", () => {
    const cloudConnectionStatusInfo: CloudConnectionProps = {
      userStatus: UserStatus.Not_Signed_Up,
      nodeStatus: "Not_Connected",
      date: "Monday 22 of May",
    }

    const { result } = renderHook(() => useCloudConnectionStatus({ ...cloudConnectionStatusInfo }))

    expect(result.current.text.footer().props.children[2].props.children).toBe("Not signed-up")
  })
})
