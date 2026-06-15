import AppError from "@/modules/shared/errors/app.error"
import { countries } from "@/config/countries"

export function validateCountry(country: string): void {
  const upper = country.toUpperCase()
  if (!(countries as readonly string[]).includes(upper)) {
    throw new AppError("Invalid country code", 400)
  }
}

export function validateYear(year?: number): void {
  if (year === undefined) return

  if (!Number.isInteger(year)) {
    throw new AppError("Invalid year", 400)
  }
}