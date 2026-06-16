import { countries, countryNames } from "@/config/countries"
import type { CountryDto } from "@/modules/climate/api/dto/country-response.dto"

export function getCountries(): CountryDto[] {
  return countries.map(code => ({
    code,
    name: countryNames[code]
  }))
}
