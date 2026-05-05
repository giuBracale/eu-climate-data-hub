import AppError from "@errors/AppError"

export function validateCountry(country: string): void {
  if (!country || country.length !== 3) {
    throw new AppError("Invalid country code", 400)
  }
}

export function validateYear(year?: number): void {
  if (year === undefined) return

  if (!Number.isInteger(year)) {
    throw new AppError("Invalid year", 400)
  }
}