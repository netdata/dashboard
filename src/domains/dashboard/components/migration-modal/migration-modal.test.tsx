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
  afterEach(() => jest.clearAllMocks())

  it("should render modal with PROMO_SIGN_UP_CLOUD ", () => {
    useLocalStorage.mockImplementation(jest.fn(() => ["CLOUD", jest.fn()]))
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
    useLocalStorage.mockImplementation(jest.fn(() => ["CLOUD", jest.fn()]))
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
    useLocalStorage.mockImplementation(jest.fn(() => ["CLOUD", jest.fn()]))
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
    useLocalStorage.mockImplementation(jest.fn(() => ["CLOUD", jest.fn()]))
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
    useLocalStorage.mockImplementation(jest.fn(() => [undefined, jest.fn()]))
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
