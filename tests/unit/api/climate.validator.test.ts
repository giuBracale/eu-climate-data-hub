import AppError from "@/modules/shared/errors/app.error"
import {
  validateCountry,
  validateYear
} from "@/modules/climate/api/climate.validator"

describe("Climate Validator", () => {
  describe("validateCountry", () => {
    it("accepts configured country codes (case-insensitive)", () => {
      expect(() => validateCountry("ITA")).not.toThrow()
      expect(() => validateCountry("usa")).not.toThrow()
    })

    it("rejects country codes not in the configured list", () => {
      for (const country of ["", "IT", "ITAL"]) {
        expect(() => validateCountry(country)).toThrow(AppError)
      }
    })
  })

  describe("validateYear", () => {
    const currentYear = new Date().getFullYear()

    it("accepts omitted and in-range integer years", () => {
      expect(() => validateYear()).not.toThrow()
      expect(() => validateYear(1900)).not.toThrow()
      expect(() => validateYear(2020)).not.toThrow()
      expect(() => validateYear(currentYear)).not.toThrow()
    })

    it("rejects years below 1900", () => {
      for (const year of [1899, 0, -1]) {
        expect(() => validateYear(year)).toThrow(AppError)
      }
    })

    it("rejects years above the current year", () => {
      expect(() => validateYear(currentYear + 1)).toThrow(AppError)
      expect(() => validateYear(9999)).toThrow(AppError)
    })

    it("rejects non-integer year values", () => {
      for (const year of [2020.5, Number.NaN, Number.POSITIVE_INFINITY]) {
        expect(() => validateYear(year)).toThrow(AppError)
      }
    })

    it("uses the correct error message", () => {
      expect(() => validateYear(1899)).toThrow(
        `Year must be an integer between 1900 and ${currentYear}`
      )
    })
  })
})
