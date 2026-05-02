import fs from "fs"
import path from "path"

import { saveMany, getByCountry } from "../infrastructure/database/climateRepository"

const RAW_DIR = path.join(__dirname, "../../data/raw")

type RawItem = {
  date: string
  value: number | null
}

type ClimateRecord = {
  country: string
  year: string
  gdp?: number | null
  population?: number | null
  co2?: number | null
}

function loadData(country: string, file: string): RawItem[] {
  const filePath = path.join(RAW_DIR, country, file)
  const raw = fs.readFileSync(filePath, "utf-8")

  const parsed = JSON.parse(raw)

  return parsed[1] as RawItem[]
}

function mergeCountryData(country: string): ClimateRecord[] {
  const gdpData = loadData(country, "gdp.json")
  const populationData = loadData(country, "population.json")
  const co2Data = loadData(country, "co2.json")

  const dataset: Record<string, ClimateRecord> = {}

  type ClimateNumericField = "gdp" | "population" | "co2"

  function insert(data: RawItem[], field: ClimateNumericField) {
    data.forEach(item => {
      const year = item.date

      if (!dataset[year]) {
        dataset[year] = { country, year }
      }

      dataset[year][field] = item.value ?? null
    })
  }

  insert(gdpData, "gdp")
  insert(populationData, "population")
  insert(co2Data, "co2")

  return Object.values(dataset).filter(
  d =>
    (d.gdp !== null && d.gdp !== undefined) ||
    (d.population !== null && d.population !== undefined) ||
    (d.co2 !== null && d.co2 !== undefined)
)
}

export async function runProcessing(): Promise<void> {
  console.log("\n Starting processing pipeline...\n")

  const countries = fs.readdirSync(RAW_DIR)

  if (!countries.length) {
    console.error(" No raw data found. Run ingestion first.")
    process.exit(1)
  }

  for (const country of countries) {
    try {
      console.log(`→ Processing ${country}...`)

      const dataset = mergeCountryData(country)

      await saveMany(dataset)

      console.log(`✔ Saved dataset to DB for ${country}\n`)
    } catch (err: any) {
      console.error(`✖ Error processing ${country}:`, err.message)
    }
  }

  console.log(" Processing completed\n")
}

//
// CLI runner
//

if (require.main === module) {
  runProcessing()
    .then(() => process.exit(0))
    .catch((err: Error) => {
      console.error(err)
      process.exit(1)
    })
}