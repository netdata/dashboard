import React from "react"
import MigrationModal from "./migration-modal"
import { render, screen, fireEvent } from "@testing-library/react"
import { migrationmodalInfo, MigrationModalPromos } from "./use-migration-modal"
import { ThemeProvider } from "styled-components"
import { DarkTheme } from "@netdata/netdata-ui"
import "@testing-library/jest-dom/extend-expect"

let assignMock = jest.fn()

delete window.location
window.location = { assign: assignMock }

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(() => ({})),
  useSelector: jest.fn(() => "hello"),
}))
describe("MigrationModal", () => {
  const closeModal = jest.fn()
  const setUserPrefrence = jest.fn()
  const savePromoRemindMeSelection = jest.fn()

  afterEach(() => jest.clearAllMocks())

  it("should render modal with PROMO_SIGN_UP_CLOUD ", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          savePromoRemindMeSelection={savePromoRemindMeSelection}
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.PROMO_SIGN_UP_CLOUD]}
          migrationModalPromo={MigrationModalPromos.PROMO_SIGN_UP_CLOUD}
        />
      </ThemeProvider>
    )
    expect(screen.getByTestId("cta1")).toBeInTheDocument()
    expect(screen.getByTestId("cta2")).toBeInTheDocument()
    expect(
      screen.getByText(migrationmodalInfo[MigrationModalPromos.PROMO_SIGN_UP_CLOUD].title)
    ).toBeInTheDocument()
    expect(screen.getByTestId("body-footer")).toBeInTheDocument()
  })

  it("should render modal with PROMO_SIGN_IN_CLOUD ", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          savePromoRemindMeSelection={savePromoRemindMeSelection}
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.PROMO_SIGN_IN_CLOUD]}
          migrationModalPromo={MigrationModalPromos.PROMO_SIGN_IN_CLOUD}
        />
      </ThemeProvider>
    )
    expect(screen.getByTestId("cta1")).toBeInTheDocument()
    expect(screen.getByTestId("cta2")).toBeInTheDocument()
    expect(
      screen.getByText(migrationmodalInfo[MigrationModalPromos.PROMO_SIGN_IN_CLOUD].title)
    ).toBeInTheDocument()
    expect(screen.getByTestId("body-footer")).toBeInTheDocument()
  })

  it("should render modal with PROMO_IVNITED_TO_SPACE (LOGGED_IN)", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          savePromoRemindMeSelection={savePromoRemindMeSelection}
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.PROMO_IVNITED_TO_SPACE]}
          migrationModalPromo={MigrationModalPromos.PROMO_IVNITED_TO_SPACE}
        />
      </ThemeProvider>
    )
    expect(screen.getByTestId("cta1")).toBeInTheDocument()
    expect(screen.queryByTestId("cta2")).not.toBeInTheDocument()
    expect(
      screen.getByText(migrationmodalInfo[MigrationModalPromos.PROMO_IVNITED_TO_SPACE].title)
    ).toBeInTheDocument()
    expect(screen.getByTestId("body-footer")).toBeInTheDocument()
  })

  it("should render modal with PROMO_IVNITED_TO_SPACE (EXPIRED_LOGIN)", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          savePromoRemindMeSelection={savePromoRemindMeSelection}
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.PROMO_IVNITED_TO_SPACE]}
          migrationModalPromo={MigrationModalPromos.PROMO_IVNITED_TO_SPACE}
        />
      </ThemeProvider>
    )
    expect(screen.getByTestId("cta1")).toBeInTheDocument()
    expect(screen.queryByTestId("cta2")).not.toBeInTheDocument()
    expect(
      screen.getByText(migrationmodalInfo[MigrationModalPromos.PROMO_IVNITED_TO_SPACE].title)
    ).toBeInTheDocument()
    expect(screen.getByTestId("body-footer")).toBeInTheDocument()
  })

  it("should render modal with PROMO_CLAIM_NODE (LOGGED_IN)", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          savePromoRemindMeSelection={savePromoRemindMeSelection}
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.PROMO_CLAIM_NODE]}
          migrationModalPromo={MigrationModalPromos.PROMO_CLAIM_NODE}
        />
      </ThemeProvider>
    )
    expect(screen.getByTestId("cta1")).toBeInTheDocument()
    expect(screen.getByTestId("cta2")).toBeInTheDocument()
    expect(
      screen.getByText(migrationmodalInfo[MigrationModalPromos.PROMO_CLAIM_NODE].title)
    ).toBeInTheDocument()
    expect(screen.getByTestId("body-footer")).toBeInTheDocument()
  })

  it("should render modal with PROMO_CLAIM_NODE (EXPIRED_LOGIN)", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          savePromoRemindMeSelection={savePromoRemindMeSelection}
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.PROMO_CLAIM_NODE]}
          migrationModalPromo={MigrationModalPromos.PROMO_CLAIM_NODE}
        />
      </ThemeProvider>
    )
    expect(screen.getByTestId("cta1")).toBeInTheDocument()
    expect(screen.getByTestId("cta2")).toBeInTheDocument()
    expect(
      screen.getByText(migrationmodalInfo[MigrationModalPromos.PROMO_CLAIM_NODE].title)
    ).toBeInTheDocument()
    expect(screen.getByTestId("body-footer")).toBeInTheDocument()
  })

  it("should render modal with PROMO_TO_USE_NEW_DASHBAORD (LOGGED_IN)", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          savePromoRemindMeSelection={savePromoRemindMeSelection}
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={
            migrationmodalInfo[MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD]
          }
          migrationModalPromo={MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD}
        />
      </ThemeProvider>
    )
    expect(screen.getByTestId("cta1")).toBeInTheDocument()
    expect(screen.getByTestId("cta2")).toBeInTheDocument()
    expect(
      screen.getByText(migrationmodalInfo[MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD].title)
    ).toBeInTheDocument()
    expect(screen.queryByTestId("body-footer")).not.toBeInTheDocument()
  })

  it("should render modal with PROMO_TO_USE_NEW_DASHBAORD (EXPIRED_LOGIN)", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          savePromoRemindMeSelection={savePromoRemindMeSelection}
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={
            migrationmodalInfo[MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD]
          }
          migrationModalPromo={MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD}
        />
      </ThemeProvider>
    )
    expect(screen.getByTestId("cta1")).toBeInTheDocument()
    expect(screen.getByTestId("cta2")).toBeInTheDocument()
    expect(
      screen.getByText(migrationmodalInfo[MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD].title)
    ).toBeInTheDocument()
    expect(screen.queryByTestId("body-footer")).not.toBeInTheDocument()
  })

  it("should render modal with FALLBACK_TO_AGENT (LOGGED_IN)", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          savePromoRemindMeSelection={savePromoRemindMeSelection}
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.FALLBACK_TO_AGENT]}
          migrationModalPromo={MigrationModalPromos.FALLBACK_TO_AGENT}
        />
      </ThemeProvider>
    )
    expect(screen.getByTestId("cta1")).toBeInTheDocument()
    expect(screen.getByTestId("cta2")).toBeInTheDocument()
    expect(
      screen.getByText(migrationmodalInfo[MigrationModalPromos.FALLBACK_TO_AGENT].title)
    ).toBeInTheDocument()
    expect(screen.queryByTestId("body-footer")).not.toBeInTheDocument()
  })

  it("should render modal with FALLBACK_TO_AGENT (EXPIRED_LOGIN)", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          savePromoRemindMeSelection={savePromoRemindMeSelection}
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.FALLBACK_TO_AGENT]}
          migrationModalPromo={MigrationModalPromos.FALLBACK_TO_AGENT}
        />
      </ThemeProvider>
    )
    expect(screen.getByTestId("cta1")).toBeInTheDocument()
    expect(screen.getByTestId("cta2")).toBeInTheDocument()
    expect(
      screen.getByText(migrationmodalInfo[MigrationModalPromos.FALLBACK_TO_AGENT].title)
    ).toBeInTheDocument()
    expect(screen.queryByTestId("body-footer")).not.toBeInTheDocument()
  })

  it("should render modal with NO_INFO_FALLBACK_TO_AGENT ", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          savePromoRemindMeSelection={savePromoRemindMeSelection}
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={
            migrationmodalInfo[MigrationModalPromos.NO_INFO_FALLBACK_TO_AGENT]
          }
          migrationModalPromo={MigrationModalPromos.NO_INFO_FALLBACK_TO_AGENT}
        />
      </ThemeProvider>
    )
    expect(screen.getByTestId("cta1")).toBeInTheDocument()
    expect(screen.getByTestId("cta2")).toBeInTheDocument()
    expect(
      screen.getByText(migrationmodalInfo[MigrationModalPromos.NO_INFO_FALLBACK_TO_AGENT].title)
    ).toBeInTheDocument()
    expect(screen.queryByTestId("body-footer")).not.toBeInTheDocument()
  })

  it("should call save the not call user prefrence when remind me checkbox is not selected", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          savePromoRemindMeSelection={savePromoRemindMeSelection}
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.PROMO_SIGN_UP_CLOUD]}
          migrationModalPromo={MigrationModalPromos.PROMO_SIGN_UP_CLOUD}
        />
      </ThemeProvider>
    )
    const cta1Button = screen.getByTestId("cta1-button")

    fireEvent.click(cta1Button)

    expect(setUserPrefrence).not.toHaveBeenCalled()
    expect(closeModal).toHaveBeenCalled()
    expect(savePromoRemindMeSelection).not.toHaveBeenCalled()
  })

  it("should call save the user prefrence when remind me checkbox is selected", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          savePromoRemindMeSelection={savePromoRemindMeSelection}
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.PROMO_SIGN_UP_CLOUD]}
          migrationModalPromo={migrationmodalInfo[MigrationModalPromos.PROMO_SIGN_UP_CLOUD]}
        />
      </ThemeProvider>
    )
    const remindMeCheckBox = screen.getByTestId("remind-me-checkbox")
    const cta1Button = screen.getByTestId("cta1-button")

    fireEvent.click(remindMeCheckBox)
    fireEvent.click(cta1Button)

    expect(setUserPrefrence).toHaveBeenCalled()
    expect(closeModal).toHaveBeenCalled()
    expect(savePromoRemindMeSelection).toHaveBeenCalled()
  })

  it("should not close modal when NO_INFO_FALLBACK_TO_AGENT ", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          savePromoRemindMeSelection={savePromoRemindMeSelection}
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={
            migrationmodalInfo[MigrationModalPromos.NO_INFO_FALLBACK_TO_AGENT]
          }
          migrationModalPromo={MigrationModalPromos.NO_INFO_FALLBACK_TO_AGENT}
        />
      </ThemeProvider>
    )
    const cta1Button = screen.getByTestId("cta1")
    fireEvent.click(cta1Button)

    expect(closeModal).not.toHaveBeenCalled()

    const cta2Button = screen.getByTestId("cta2")
    fireEvent.click(cta2Button)

    expect(closeModal).toHaveBeenCalled()
  })

  it("should render modal with FALLBACK_TO_AGENT (LOGGED_IN)", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          savePromoRemindMeSelection={savePromoRemindMeSelection}
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.FALLBACK_TO_AGENT]}
          migrationModalPromo={MigrationModalPromos.FALLBACK_TO_AGENT}
        />
      </ThemeProvider>
    )

    const cta1Button = screen.getByTestId("cta1")
    fireEvent.click(cta1Button)

    expect(closeModal).not.toHaveBeenCalled()

    const cta2Button = screen.getByTestId("cta2")
    fireEvent.click(cta2Button)

    expect(closeModal).toHaveBeenCalled()
  })
})
