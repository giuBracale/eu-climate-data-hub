const service = require("../../src/domain/services/climateDataService")

describe("Climate Data Service", () => {

  const dataset = [
    { year: "2000", gdp: 100, population: 10, co2: 5 },
    { year: "2010", gdp: 150, population: 15, co2: 7 },
    { year: "2020", gdp: 200, population: 20, co2: 10 }
  ]

  test("should return latest record", () => {
    const latest = service.getLatest(dataset)

    expect(latest.year).toBe("2020")
    expect(latest).toHaveProperty("gdp")
  })

  test("should compute trend correctly", () => {
    const trend = service.getTrend(dataset)

    expect(trend).toHaveProperty("period")
    expect(trend.gdp_growth).toBe(100)
    expect(trend.population_growth).toBe(10)
    expect(trend.co2_change).toBe(5)
  })

  test("should get data by year", () => {
    const record = service.getByYear(dataset, "2010")

    expect(record.year).toBe("2010")
    expect(record.gdp).toBe(150)
  })

})