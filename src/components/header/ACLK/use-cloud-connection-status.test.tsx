import { renderHook } from "@testing-library/react-hooks"
import useCloudConnectionStatus from "./use-cloud-connection-status"
import { CloudConnectionProps } from "./types"

describe("useCloudConnectionStatus", () => {
  it("should return correct status when node is connected and user logged in ", () => {
    const cloudConnectionStatusInfo: CloudConnectionProps = {
      userStatus: "LOGGED_IN",
      nodeStatus: "LIVE",
      date: "Monday 22 of May",
    }

    const { result } = renderHook(() => useCloudConnectionStatus({ ...cloudConnectionStatusInfo }))

    expect(result.current.text.bullets).toHaveLength(0)
    expect(result.current.text.footer().props.children[2].props.children).toBe("Logged In")
    expect(result.current.text.header().props.children[2].props.children).toBe("Connected")
  })

  it("should return correct status when node i nots connected and user is logged out ", () => {
    const cloudConnectionStatusInfo: CloudConnectionProps = {
      userStatus: "EXPIRED_LOGIN",
      nodeStatus: "NOT_LIVE",
      date: "Monday 22 of May",
    }

    const { result } = renderHook(() => useCloudConnectionStatus({ ...cloudConnectionStatusInfo }))

    expect(result.current.text.bullets).toHaveLength(1)
    expect(result.current.text.footer().props.children[2].props.children).toBe("Logged out")
    expect(result.current.text.header().props.children[2].props.children).toBe("Not Connected")
  })

  it("should return correct status when user is not signedup ", () => {
    const cloudConnectionStatusInfo: CloudConnectionProps = {
      userStatus: "UNKNOWN",
      nodeStatus: "NOT_LIVE",
      date: "Monday 22 of May",
    }

    const { result } = renderHook(() => useCloudConnectionStatus({ ...cloudConnectionStatusInfo }))

    expect(result.current.text.footer().props.children[2].props.children).toBe("Not signed-up")
  })
})
