import AppError from "../../domain/errors/AppError"

export function validateCountry(country: string): void {
  if (!country || country.length !== 3) {
    throw new AppError("Invalid country code", 400)
  }
}

export function validateYear(year?: string): void {
  if (year !== undefined && isNaN(Number(year))) {
    throw new AppError("Invalid year format", 400)
  }
}