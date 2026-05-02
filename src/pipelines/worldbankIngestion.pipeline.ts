import fs from "fs"
import path from "path"

import { indicators, IndicatorKey } from "../config/indicators"
import { fetchIndicator } from "../infrastructure/worldbank/worldbankClient"

// directory raw data
const RAW_DIR = path.join(__dirname, "../../data/raw")

// tipo risposta World Bank (semplificato)
type WorldBankRecord = {
  date: string
  value: number | null
}

type WorldBankData = [unknown, WorldBankRecord[]]

// salva file raw
function saveRawData(
  country: string,
  filename: string,
  data: WorldBankData
): void {
  const dir = path.join(RAW_DIR, country)

  fs.mkdirSync(dir, { recursive: true })

  const filePath = path.join(dir, filename)

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

// pipeline ingestion
export async function runWorldBankPipeline(
  country: string
): Promise<void> {
  console.log(`\n Starting ingestion for ${country}...\n`)

  for (const key of Object.keys(indicators) as IndicatorKey[]) {
    const indicator = indicators[key]

    try {
      console.log(`→ Fetching ${key}...`)

      const data = await fetchIndicator(country, indicator)

      saveRawData(country, `${key}.json`, data)

      console.log(`✔ Saved ${key}`)
    } catch (err) {
      console.error(`✖ Error fetching ${key}:`, (err as Error).message)
    }
  }

  console.log(`\n Ingestion completed for ${country}\n`)
}

// CLI runner (ok anche in TS con commonjs)
if (require.main === module) {
  const country = process.argv[2]

  if (!country) {
    console.error(" Please provide a country code (e.g. ITA)")
    process.exit(1)
  }

  runWorldBankPipeline(country)
    .then(() => process.exit(0))
    .catch((err: Error) => {
      console.error(err)
      process.exit(1)
    })
}