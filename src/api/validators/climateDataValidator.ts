import AppError from "@errors/AppError"

export function validateCountry(country: string): void {
  if (!country || country.length !== 3) {
    throw new AppError("Invalid country code", 400)
  }
}

export function validateYear(year?: string): void {
  if (!year) return

  const parsed = Number(year)

  if (isNaN(parsed)) {
    throw new AppError("Invalid year", 400)
  }
}