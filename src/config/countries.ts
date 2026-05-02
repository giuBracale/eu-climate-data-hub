export const countries = [
  "ITA",
  "FRA",
  "DEU",
  "ESP",
  "USA"
] as const

export type CountryCode = typeof countries[number]