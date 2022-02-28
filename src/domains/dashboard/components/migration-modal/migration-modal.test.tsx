import React from "react"
import MigrationModal from "./migration-modal"
import { render, screen } from "@testing-library/react"
import { migrationmodalInfo, MigrationModalPromos } from "./use-migration-modal"
import { ThemeProvider } from "styled-components"
import { DarkTheme } from "@netdata/netdata-ui"
import "@testing-library/jest-dom/extend-expect"

describe("MigrationModal", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })
  it("should render modal with PROMO_SIGN_UP_CLOUD ", () => {
    window.localStorage.setItem("USER_SAVED_PREFERENCE", "CLOUD")
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal />
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
    window.localStorage.setItem("USER_SAVED_PREFERENCE", "CLOUD")
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal userStatus="UNKNOWN" nodeClaimedStatus="CLAIMED" />
      </ThemeProvider>
    )
    expect(screen.getByTestId("cta1")).toBeInTheDocument()
    expect(screen.getByTestId("cta2")).toBeInTheDocument()
    expect(
      screen.getByText(migrationmodalInfo[MigrationModalPromos.PROMO_SIGN_IN_CLOUD].title)
    ).toBeInTheDocument()
    expect(screen.getByTestId("body-footer")).toBeInTheDocument()
  })

  it("should render modal with PROMO_IVNITED_TO_SPACE", () => {
    window.localStorage.setItem("USER_SAVED_PREFERENCE", "CLOUD")
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal
          userStatus="LOGGED_IN"
          nodeClaimedStatus="CLAIMED"
          userNodeAccess="NO_ACCESS"
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

  it("should render modal with PROMO_CLAIM_NODE", () => {
    window.localStorage.setItem("USER_SAVED_PREFERENCE", "CLOUD")
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal userStatus="LOGGED_IN" nodeClaimedStatus="NOT_CLAIMED" />
      </ThemeProvider>
    )
    expect(screen.getByTestId("cta1")).toBeInTheDocument()
    expect(screen.getByTestId("cta2")).toBeInTheDocument()
    expect(
      screen.getByText(migrationmodalInfo[MigrationModalPromos.PROMO_CLAIM_NODE].title)
    ).toBeInTheDocument()
    expect(screen.getByTestId("body-footer")).toBeInTheDocument()
  })

  it("should render modal with PROMO_TO_USE_NEW_DASHBAORD", () => {
    window.localStorage.setItem("USER_SAVED_PREFERENCE", undefined)
    render(
      <ThemeProvider theme={DarkTheme}>
        <MigrationModal userStatus="LOGGED_IN" userNodeAccess="ACCESS_OK" nodeLiveness="LIVE" />
      </ThemeProvider>
    )
    expect(screen.getByTestId("cta1")).toBeInTheDocument()
    expect(screen.getByTestId("cta2")).toBeInTheDocument()
    expect(
      screen.getByText(migrationmodalInfo[MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD].title)
    ).toBeInTheDocument()
    expect(screen.queryByTestId("body-footer")).not.toBeInTheDocument()
  })
})
