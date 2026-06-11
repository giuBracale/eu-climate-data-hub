import AppError from "@/modules/shared/errors/app.error"
import {
  toClimateDataDto,
  toClimateDataListDto
} from "@/modules/climate/api/dto/climate-data-response.dto"
import { toClimateTrendDto } from "@/modules/climate/api/dto/climate-trend-response.dto"
import { toGetClimateDataRequestDto } from "@/modules/climate/api/dto/get-climate-data-request.dto"

describe("Climate DTOs", () => {
  describe("toClimateDataDto", () => {
    it("maps valid raw climate records", () => {
      expect(
        toClimateDataDto({
          country: "ITA",
          year: "2020",
          gdp: 100,
          population: 60,
          co2: 20
        })
      ).toEqual({
        country: "ITA",
        year: 2020,
        gdp: 100,
        population: 60,
        co2: 20
      })
    })

    it("maps null and undefined metric values to null", () => {
      expect(
        toClimateDataDto({
          country: "ITA",
          year: 2020,
          gdp: null,
          population: undefined,
          co2: undefined
        })
      ).toEqual({
        country: "ITA",
        year: 2020,
        gdp: null,
        population: null,
        co2: null
      })
    })

    it("maps lists without changing order", () => {
      expect(
        toClimateDataListDto([
          { country: "ITA", year: "2020", gdp: 100 },
          { country: "FRA", year: 2021, population: 67 }
        ])
      ).toEqual([
        { country: "ITA", year: 2020, gdp: 100, population: null, co2: null },
        { country: "FRA", year: 2021, gdp: null, population: 67, co2: null }
      ])
    })

    it("returns an empty list for empty input", () => {
      expect(toClimateDataListDto([])).toEqual([])
    })

    it("throws when the raw climate record is invalid", () => {
      expect(() => toClimateDataDto(undefined as never)).toThrow(TypeError)
    })
  })

  describe("toClimateTrendDto", () => {
    it("maps valid raw trend data", () => {
      expect(
        toClimateTrendDto({
          period: "2000-2020",
          gdp_growth: 100,
          population_growth: 50,
          co2_change: -25
        })
      ).toEqual({
        period: "2000-2020",
        gdpGrowth: 100,
        populationGrowth: 50,
        co2Change: -25
      })
    })

    it("maps null and undefined trend values to null", () => {
      expect(
        toClimateTrendDto({
          period: "2000-2020",
          gdp_growth: null,
          population_growth: undefined as never,
          co2_change: undefined as never
        })
      ).toEqual({
        period: "2000-2020",
        gdpGrowth: null,
        populationGrowth: null,
        co2Change: null
      })
    })

    it("returns null for null or undefined trends", () => {
      expect(toClimateTrendDto(null)).toBeNull()
      expect(toClimateTrendDto(undefined as never)).toBeNull()
    })
  })

  describe("toGetClimateDataRequestDto", () => {
    it("maps valid route params and uppercases the country", () => {
      expect(
        toGetClimateDataRequestDto({
          country: "ita",
          year: "2020"
        })
      ).toEqual({
        country: "ITA",
        year: 2020
      })
    })

    it("omits year when it is not provided", () => {
      expect(toGetClimateDataRequestDto({ country: "FRA" })).toEqual({
        country: "FRA"
      })
    })

    it("preserves numeric boundary years", () => {
      expect(
        toGetClimateDataRequestDto({
          country: "ITA",
          year: "0"
        })
      ).toEqual({
        country: "ITA",
        year: 0
      })
    })

    it("rejects invalid year params", () => {
      expect(() =>
        toGetClimateDataRequestDto({
          country: "ITA",
          year: "not-a-year"
        })
      ).toThrow(AppError)
    })

    it("rejects missing country params", () => {
      expect(() => toGetClimateDataRequestDto({})).toThrow(
        "Country is required"
      )
    })
  })
})
