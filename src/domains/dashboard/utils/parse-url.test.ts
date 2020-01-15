import { parseUrl } from "./parse-url"

describe("parse url test", () => {
  describe("isPrintModeFn", () => {
    it("returns the same mode as given in hash", () => {
      expect(
        parseUrl("#menu_system_submenu_cpu;theme=slate;mode=print"),
      ).toHaveProperty("mode", "print")
    })
    it("returns default mode when no mode is present in hash", () => {
      expect(
        parseUrl("#menu_system_submenu_cpu;theme=slate"),
      ).toHaveProperty("mode", "live")
    })
  })
})
