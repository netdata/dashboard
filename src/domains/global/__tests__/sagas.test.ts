import { parsePersonUrls, PersonUrl } from "../sagas"

const urls = [
  ["fa6f3c3c-9f5b-11e9-a8bd-4c32759d745d", "http%3A%2F%2Flocalhost%3A19999%2F", 1574242655000, 13,
    "machine.name1"],
  ["fa6f3c3c-9f5b-11e9-a8bd-4c32759d745d", "http://localhost:19999/", 1573760622000, 38,
    "machine.name2"],
] as PersonUrl[]


describe("global sagas", () => {
  describe("parse person urls", () => {
    it("combines 2 machines with same guid", () => {
      const outputRegistryMachines = {
        "fa6f3c3c-9f5b-11e9-a8bd-4c32759d745d": {
          accesses: 51,
          alternateUrls: [
            "http://localhost:19999/",
            "http%3A%2F%2Flocalhost%3A19999%2F",
          ],
          guid: "fa6f3c3c-9f5b-11e9-a8bd-4c32759d745d",
          lastTimestamp: 1574242655000,
          name: "machine.name1",
          url: "http%3A%2F%2Flocalhost%3A19999%2F",
        },
      }
      const output = {
        registryMachines: outputRegistryMachines,
        registryMachinesArray: [
          {
            accesses: 51,
            alternateUrls: [
              "http://localhost:19999/",
              "http%3A%2F%2Flocalhost%3A19999%2F",
            ],
            guid: "fa6f3c3c-9f5b-11e9-a8bd-4c32759d745d",
            lastTimestamp: 1574242655000,
            name: "machine.name1",
            url: "http%3A%2F%2Flocalhost%3A19999%2F",
          },
        ],
      }
      expect(parsePersonUrls(urls)).toEqual(output)
    })
  })
})
