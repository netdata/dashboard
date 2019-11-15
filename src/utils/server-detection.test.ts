import {alwaysEndWithSlash, getPathFromScriptSource} from "utils/server-detection"

describe("server detection", () => {
  describe(" * endWithSlash function", () => {
    it(" * should add slash when it's not present at the end", () => {
      expect(alwaysEndWithSlash("some.domain")).toBe("some.domain/")
      expect(alwaysEndWithSlash("som/e.domain")).toBe("som/e.domain/")
    })
    it(" * should leave as it is when trailing with slash", () => {
      expect(alwaysEndWithSlash("some.domain/")).toBe("some.domain/")
      expect(alwaysEndWithSlash("som/e.domain/")).toBe("som/e.domain/")
    })
  })

  describe(" * getPathFromScriptSource function", () => {
    it(" * should return path without js filename", () => {
      expect(getPathFromScriptSource("http://localhost:19999/dashboard.js"))
        .toBe("http://localhost:19999/")

      expect(getPathFromScriptSource("http://localhost:19999/route/dashboard.js"))
        .toBe("http://localhost:19999/route/")
    })
  })
})
