import fs from "fs"
import path from "path"

type ClimateRecord = {
  country: string
  year: string
  gdp?: number | null
  population?: number | null
  co2?: number | null
}

function getFilePath(country: string): string {
  return path.join(
    __dirname,
    `../../../data/processed/climate_${country}.json`
  )
}

export function getDataset(country: string): ClimateRecord[] {
  const filePath = getFilePath(country)

  const raw = fs.readFileSync(filePath, "utf-8")

  return JSON.parse(raw) as ClimateRecord[]
}