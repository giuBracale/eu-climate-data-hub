const service = require("../../src/services/climateDataService")

describe("Climate Data Service", () => {

  test("load dataset for country", () => {

    const dataset = service.getDataset("ITA")

    expect(Array.isArray(dataset)).toBe(true)

  })

  test("latest record should contain year", () => {

    const latest = service.getLatest("ITA")

    expect(latest).toHaveProperty("year")

  })

})