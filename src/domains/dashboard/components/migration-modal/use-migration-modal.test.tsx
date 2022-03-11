import { renderHook } from "@testing-library/react-hooks"
import useMigrationModal, {
  PromoProps,
  MigrationModalPromos,
  migrationmodalInfo,
} from "./use-migration-modal"

jest.mock("react-use", () => ({
  useLocalStorage: jest.fn(() => ["NONE", jest.fn()]),
}))

import { useLocalStorage } from "react-use"
describe("useMigrationModal", () => {
  afterEach(() => jest.clearAllMocks())
  it("should return promo PROMO_SIGN_UP_CLOUD", () => {
    const promoProps: PromoProps = { userStatus: "UNKNOWN", nodeClaimedStatus: "NOT_CLAIMED" }
    const expectedPromo = migrationmodalInfo[MigrationModalPromos.PROMO_SIGN_UP_CLOUD]

    const { result } = renderHook(() => useMigrationModal({ ...promoProps }))

    expect(result.current.migrationModalPromoInfo).toEqual(expectedPromo)
    expect(result.current.migrationModalPromo).toEqual(MigrationModalPromos.PROMO_SIGN_UP_CLOUD)
  })

  it("should return promo PROMO_SIGN_IN_CLOUD", () => {
    const promoProps: PromoProps = { userStatus: "UNKNOWN", nodeClaimedStatus: "CLAIMED" }

    const expectedPromo = migrationmodalInfo[MigrationModalPromos.PROMO_SIGN_IN_CLOUD]

    const { result } = renderHook(() => useMigrationModal({ ...promoProps }))

    expect(result.current.migrationModalPromoInfo).toEqual(expectedPromo)
    expect(result.current.migrationModalPromo).toEqual(MigrationModalPromos.PROMO_SIGN_IN_CLOUD)
  })

  it("should return promo PROMO_IVNITED_TO_SPACE ", () => {
    const promoPropsWithLoggedIn: PromoProps = {
      userStatus: "LOGGED_IN",
      nodeClaimedStatus: "CLAIMED",
      userNodeAccess: "NO_ACCESS",
    }

    const promoPropsWithLoggedOut: PromoProps = {
      userStatus: "EXPIRED_LOGIN",
      nodeClaimedStatus: "CLAIMED",
      userNodeAccess: "NO_ACCESS",
    }

    const expectedPromo = migrationmodalInfo[MigrationModalPromos.PROMO_IVNITED_TO_SPACE]

    const { result } = renderHook(() => useMigrationModal({ ...promoPropsWithLoggedIn }))
    const { result: resultWithLogout } = renderHook(() =>
      useMigrationModal({ ...promoPropsWithLoggedOut })
    )

    expect(result.current.migrationModalPromoInfo).toEqual(expectedPromo)
    expect(result.current.migrationModalPromo).toEqual(MigrationModalPromos.PROMO_IVNITED_TO_SPACE)

    expect(resultWithLogout.current.migrationModalPromoInfo).toEqual(expectedPromo)
  })

  it("should return promo PROMO_CLAIM_NODE ", () => {
    const promoPropsWithLoggedIn: PromoProps = {
      userStatus: "LOGGED_IN",
      nodeClaimedStatus: "NOT_CLAIMED",
    }
    const promoPropsWithLoggedOut: PromoProps = {
      userStatus: "EXPIRED_LOGIN",
      nodeClaimedStatus: "NOT_CLAIMED",
    }
    const expectedPromo = migrationmodalInfo[MigrationModalPromos.PROMO_CLAIM_NODE]

    const { result } = renderHook(() => useMigrationModal({ ...promoPropsWithLoggedIn }))
    const { result: resultWithLogout } = renderHook(() =>
      useMigrationModal({ ...promoPropsWithLoggedOut })
    )

    expect(result.current.migrationModalPromoInfo).toEqual(expectedPromo)
    expect(resultWithLogout.current.migrationModalPromoInfo).toEqual(expectedPromo)
    expect(result.current.migrationModalPromo).toEqual(MigrationModalPromos.PROMO_CLAIM_NODE)
  })

  it("should return promo PROMO_TO_USE_NEW_DASHBAORD ", () => {
    useLocalStorage.mockImplementation(jest.fn(() => [undefined, jest.fn()]))

    const promoPropsWithLoggedIn: PromoProps = {
      userStatus: "LOGGED_IN",
      nodeLiveness: "LIVE",
      userNodeAccess: "ACCESS_OK",
    }
    const promoPropsWithLoggedOut: PromoProps = {
      userStatus: "EXPIRED_LOGIN",
      nodeLiveness: "LIVE",
      userNodeAccess: "ACCESS_OK",
    }
    const expectedPromo = migrationmodalInfo[MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD]

    const { result } = renderHook(() => useMigrationModal({ ...promoPropsWithLoggedIn }))
    const { result: resultWithLogout } = renderHook(() =>
      useMigrationModal({ ...promoPropsWithLoggedOut })
    )

    expect(result.current.migrationModalPromoInfo).toEqual(expectedPromo)
    expect(resultWithLogout.current.migrationModalPromoInfo).toEqual(expectedPromo)
    expect(result.current.migrationModalPromo).toEqual(
      MigrationModalPromos.PROMO_TO_USE_NEW_DASHBAORD
    )
  })

  it("should return promo FALLBACK_TO_AGENT ", () => {
    useLocalStorage.mockImplementation(jest.fn(() => ["CLOUD", jest.fn()]))

    const promoPropsWithLoggedIn: PromoProps = {
      userStatus: "LOGGED_IN",
      nodeLiveness: "NOT_LIVE",
      userNodeAccess: "ACCESS_OK",
      nodeClaimedStatus: "CLAIMED",
    }
    const promoPropsWithLoggedOut: PromoProps = {
      userStatus: "EXPIRED_LOGIN",
      nodeLiveness: "NOT_LIVE",
      userNodeAccess: "ACCESS_OK",
      nodeClaimedStatus: "CLAIMED",
    }
    const expectedPromo = migrationmodalInfo[MigrationModalPromos.FALLBACK_TO_AGENT]

    const { result } = renderHook(() => useMigrationModal({ ...promoPropsWithLoggedIn }))
    const { result: resultWithLogout } = renderHook(() =>
      useMigrationModal({ ...promoPropsWithLoggedOut })
    )

    expect(result.current.migrationModalPromoInfo).toEqual(expectedPromo)
    expect(resultWithLogout.current.migrationModalPromoInfo).toEqual(expectedPromo)
    expect(result.current.migrationModalPromo).toEqual(MigrationModalPromos.FALLBACK_TO_AGENT)
  })

  it("should return promo NO_INFO_FALLBACK_TO_AGENT ", () => {
    useLocalStorage.mockImplementation(jest.fn(() => ["CLOUD", jest.fn()]))

    const promoProps: PromoProps = {
      userStatus: undefined,
      nodeLiveness: undefined,
      userNodeAccess: undefined,
      nodeClaimedStatus: undefined,
    }

    const expectedPromo = migrationmodalInfo[MigrationModalPromos.NO_INFO_FALLBACK_TO_AGENT]

    const { result } = renderHook(() => useMigrationModal({ ...promoProps }))

    expect(result.current.migrationModalPromoInfo).toEqual(expectedPromo)
    expect(result.current.migrationModalPromo).toEqual(
      MigrationModalPromos.NO_INFO_FALLBACK_TO_AGENT
    )
  })
})
