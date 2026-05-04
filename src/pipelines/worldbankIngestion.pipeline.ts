import fs from "fs"
import path from "path"
import { logger } from "@utils/logger"

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
  logger.info({ country }, "Starting ingestion")

  for (const key of Object.keys(indicators) as IndicatorKey[]) {
    const indicator = indicators[key]

    try {
      logger.info({ country, indicator: key }, "Fetching indicator")

      const data = await fetchIndicator(country, indicator)

      saveRawData(country, `${key}.json`, data)

      logger.info({ country, indicator: key }, "Indicator saved")
    } catch (err) {
      logger.error(
        { err, country, indicator: key },
        "Error fetching indicator"
      )
    }
  }


  logger.info({ country }, "Ingestion completed")
}

// CLI runner 
if (require.main === module) {
  const country = process.argv[2]

  if (!country) {
    logger.error("Missing country code")
    process.exit(1)
  }

  runWorldBankPipeline(country)
    .then(() => process.exit(0))
    .catch((err: Error) => {
      logger.error({ err }, "Ingestion failed")
      process.exit(1)
    })
}