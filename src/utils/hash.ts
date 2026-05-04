import crypto from "crypto"
import { ClimateData } from "@prisma/client"

export function computeHash(data: ClimateData[]): string {
  const normalized = data.map(d => ({
    year: d.year,
    gdp: d.gdp ?? null,
    population: d.population ?? null,
    co2: d.co2 ?? null
  }))

  return crypto
    .createHash("md5")
    .update(JSON.stringify(normalized))
    .digest("hex")
}