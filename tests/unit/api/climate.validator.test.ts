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
    it("accepts omitted and integer years", () => {
      expect(() => validateYear()).not.toThrow()
      expect(() => validateYear(0)).not.toThrow()
      expect(() => validateYear(-1)).not.toThrow()
      expect(() => validateYear(2020)).not.toThrow()
    })

    it("rejects non-integer year values", () => {
      for (const year of [2020.5, Number.NaN, Number.POSITIVE_INFINITY]) {
        expect(() => validateYear(year)).toThrow(AppError)
      }
    })
  })
})
