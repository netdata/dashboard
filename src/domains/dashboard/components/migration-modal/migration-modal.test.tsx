import React from "react"
import MigrationModal from "./migration-modal"
import { render, screen } from "@testing-library/react"
import { migrationmodalInfo, MigrationModalPromos } from "./use-migration-modal"
import { ThemeProvider } from "styled-components"
import { DarkTheme } from "@netdata/netdata-ui"
import "@testing-library/jest-dom/extend-expect"

jest.mock("react-use", () => ({
  useLocalStorage: jest.fn(() => ["NONE", jest.fn()]),
}))

import { useLocalStorage } from "react-use"

describe("MigrationModal", () => {
  const closeModal = jest.fn()
  const setUserPrefrence = jest.fn()
  afterEach(() => jest.clearAllMocks())

  it("should render modal with PROMO_SIGN_UP_CLOUD ", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.PROMO_SIGN_UP_CLOUD]}
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
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.PROMO_SIGN_IN_CLOUD]}
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
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.PROMO_IVNITED_TO_SPACE]}
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

  it("should render modal with PROMO_IVNITED_TO_SPACE (LOGGED_OUT)", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.PROMO_IVNITED_TO_SPACE]}
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
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.PROMO_CLAIM_NODE]}
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

  it("should render modal with PROMO_CLAIM_NODE (LOGGED_OUT)", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.PROMO_CLAIM_NODE]}
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
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={
            migrationmodalInfo[MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD]
          }
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

  it("should render modal with PROMO_TO_USE_NEW_DASHBAORD (LOGGED_OUT)", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={
            migrationmodalInfo[MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD]
          }
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
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.FALLBACK_TO_AGENT]}
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

  it("should render modal with FALLBACK_TO_AGENT (LOGGED_OUT)", () => {
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={migrationmodalInfo[MigrationModalPromos.FALLBACK_TO_AGENT]}
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
          closeModal={closeModal}
          setUserPrefrence={setUserPrefrence}
          migrationModalPromoInfo={
            migrationmodalInfo[MigrationModalPromos.NO_INFO_FALLBACK_TO_AGENT]
          }
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
})
