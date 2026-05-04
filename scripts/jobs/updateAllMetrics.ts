import { updateMetricsForCountry } from "../../src/processing/updateMetrics"
import fs from "fs"
import path from "path"
import { logger } from "@utils/logger"

const RAW_DIR = path.join(__dirname, "../../data/raw")

async function run() {
  const countries = fs.readdirSync(RAW_DIR)

  for (const country of countries) {
    logger.info({ country }, "Updating metrics")
    await updateMetricsForCountry(country)
  }

  logger.info("Metrics update completed")
}

run().catch(err => {
  logger.error({ err }, "Metrics job failed")
  process.exit(1)
})