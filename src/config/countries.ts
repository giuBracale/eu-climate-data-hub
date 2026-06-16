export const countries = [
  "ITA",
  "FRA",
  "DEU",
  "ESP",
  "USA"
] as const

export type CountryCode = typeof countries[number]

export const countryNames: Record<CountryCode, string> = {
  ITA: "Italy",
  FRA: "France",
  DEU: "Germany",
  ESP: "Spain",
  USA: "United States"
}