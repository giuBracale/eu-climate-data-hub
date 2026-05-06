import fs from "fs"
import path from "path"
import { logger } from "@/modules/shared/utils/logger"

import { saveMany, getByCountry } from "../../infrastructure/database/climate.repository"

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

  logger.info("Starting processing pipeline")

  const countries = fs.readdirSync(RAW_DIR)

  if (!countries.length) {
    logger.error("No raw data found. Run ingestion first.")
    process.exit(1)
  }

  for (const country of countries) {
    try {
      logger.info({ country }, "Processing country")

      const dataset = mergeCountryData(country)

      await saveMany(dataset)

      logger.info({ country }, "Dataset saved")
    } catch (err: any) {
      logger.error({ err, country }, "Error processing country")
    }
  }

  logger.info("Processing completed")
}



//
// CLI runner
//

if (require.main === module) {
  runProcessing()
    .then(() => process.exit(0))
    .catch((err: Error) => {
      logger.error({ err }, "Processing pipeline error")
      process.exit(1)
    })
}