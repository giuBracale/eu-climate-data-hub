import AppError from "@/modules/shared/errors/app.error"
import { countries } from "@/config/countries"

export function validateCountry(country: string): void {
  const upper = country.toUpperCase()
  if (!(countries as readonly string[]).includes(upper)) {
    throw new AppError("Invalid country code", 400)
  }
}

const MIN_YEAR = 1900
const MAX_YEAR = new Date().getFullYear()

export function validateYear(year?: number): void {
  if (year === undefined) return

  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
    throw new AppError(`Year must be an integer between ${MIN_YEAR} and ${MAX_YEAR}`, 400)
  }
}