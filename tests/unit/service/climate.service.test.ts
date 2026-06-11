import * as service from "@/modules/climate/application/climate.service"
import { ClimateRecord } from "@/types/types"

describe("Climate Data Service", () => {
  const dataset: ClimateRecord[] = [
    { country: "ITA", year: 2000, gdp: 100, population: 10, co2: 5 },
    { country: "ITA", year: 2010, gdp: 150, population: 15, co2: 7 },
    { country: "ITA", year: 2020, gdp: 200, population: 20, co2: 10 }
  ]

  it("should return latest record", () => {
    const latest = service.getLatest(dataset)!

    expect(latest).toBeDefined()
    expect(latest?.year).toBe(2020)
    expect(latest).toHaveProperty("gdp")
  })

  it("should ignore records without any metric when finding latest", () => {
    const latest = service.getLatest([
      { country: "ITA", year: 2021, gdp: null, population: null, co2: null },
      { country: "ITA", year: 2019, gdp: null, population: 12, co2: null },
      { country: "ITA", year: 2020, gdp: null, population: null, co2: 8 }
    ])

    expect(latest?.year).toBe(2020)
  })

  it("should return undefined for latest when no record has metrics", () => {
    const latest = service.getLatest([
      { country: "ITA", year: 2020, gdp: null, population: null, co2: null }
    ])

    expect(latest).toBeUndefined()
  })

  it("should compute trend correctly", () => {
    const trend = service.getTrend(dataset)

    expect(trend).toHaveProperty("period")
    expect(trend?.gdp_growth).toBe(100)
    expect(trend?.population_growth).toBe(100)
    expect(trend?.co2_change).toBe(100)
  })

  it("should compute trend from the earliest and latest valid records", () => {
    const trend = service.getTrend([
      { country: "ITA", year: 2020, gdp: 300, population: 30, co2: 15 },
      { country: "ITA", year: 1990, gdp: null, population: null, co2: null },
      { country: "ITA", year: 2000, gdp: 100, population: 10, co2: 5 },
      { country: "ITA", year: 2010, gdp: null, population: 15, co2: null }
    ])

    expect(trend).toEqual({
      period: "2000-2020",
      gdp_growth: 200,
      population_growth: 200,
      co2_change: 200
    })
  })

  it("should return null trend for empty dataset", () => {
    const trend = service.getTrend([])
    expect(trend).toBeNull()
  })

  it("should return null trend for a single valid record", () => {
    const trend = service.getTrend([
      { country: "ITA", year: 2020, gdp: 100, population: null, co2: null }
    ])

    expect(trend).toBeNull()
  })

  it("should return null growth when first, last, or zero values cannot grow", () => {
    const trend = service.getTrend([
      { country: "ITA", year: 2000, gdp: 0, population: null, co2: 5 },
      { country: "ITA", year: 2020, gdp: 100, population: 20, co2: null }
    ])

    expect(trend).toEqual({
      period: "2000-2020",
      gdp_growth: null,
      population_growth: null,
      co2_change: null
    })
  })

  it("should get data by year", () => {
    const record = service.getByYear(dataset, 2010)

    expect(record?.year).toBe(2010)
    expect(record?.gdp).toBe(150)
  })

  it("should return undefined for missing year", () => {
    const record = service.getByYear(dataset, 9999)
    expect(record).toBeUndefined()
  })
})
