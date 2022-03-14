import React from "react"
import CloudConnectionStatusModal from "./cloud-connection-status-modal"
import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeProvider } from "styled-components"
import { DarkTheme } from "@netdata/netdata-ui"
import { ConnectionModalStatusContent } from "./types"
import "@testing-library/jest-dom/extend-expect"

const assignMock = jest.fn()

delete window.location
window.location = { assign: assignMock }

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(() => ({})),
  useSelector: jest.fn(() => "hello"),
}))

describe("CloudConnectionStatus", () => {
  const closeModal = jest.fn()
  const onRefresh = jest.fn()

  const title = "Here is modal title"
  const text: ConnectionModalStatusContent["text"] = {
    header: () => <div>Header</div>,
    footer: () => <div>Footer</div>,
    bullets: [() => <div>Bullets</div>],
  }
  const CTA1 = {
    text: "Take me to Netdata Cloud",
  }

  afterEach(() => jest.clearAllMocks())

  it("should render modal", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <CloudConnectionStatusModal
          CTA1={CTA1}
          title={title}
          text={text}
          isCTA1Disabled={false}
          closeModal={closeModal}
          onRefresh={onRefresh}
        />
      </ThemeProvider>
    )

    expect(screen.getByTestId("cta1-button")).toBeInTheDocument()
    expect(screen.getByTestId("cta2-button")).toBeInTheDocument()
    expect(screen.getByText("Header")).toBeInTheDocument()
    expect(screen.getByText("Footer")).toBeInTheDocument()
    expect(screen.getByText("Bullets")).toBeInTheDocument()
  })

  it("should click the buttons", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <CloudConnectionStatusModal
          CTA1={CTA1}
          title={title}
          text={text}
          isCTA1Disabled={false}
          closeModal={closeModal}
          onRefresh={onRefresh}
        />
      </ThemeProvider>
    )

    const cta1Button = screen.getByTestId("cta1-button")

    fireEvent.click(cta1Button)

    const cta2Button = screen.getByTestId("cta2-button")

    fireEvent.click(cta2Button)

    expect(closeModal).toHaveBeenCalled()
    expect(onRefresh).toHaveBeenCalled()
  })

  it("should disable the go to netdata cloud button", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <CloudConnectionStatusModal
          CTA1={CTA1}
          title={title}
          text={text}
          isCTA1Disabled={true}
          closeModal={closeModal}
          onRefresh={onRefresh}
        />
      </ThemeProvider>
    )

    const cta1Button = screen.getByTestId("cta1-button")

    fireEvent.click(cta1Button)

    expect(screen.getByTestId("cta1-button")).toHaveAttribute("disabled")
    expect(closeModal).not.toHaveBeenCalled()
  })
})
