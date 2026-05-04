import { runWorldBankPipeline } from "@pipelines/worldbankIngestion.pipeline"
import { countries } from "@config/countries"
import { logger } from "@utils/logger"

async function run() {
  for (const country of countries) {
    logger.info({ country }, "Fetching data")
    await runWorldBankPipeline(country)
  }

  logger.info("Pipeline completed")
}

run().catch(err => {
  logger.error({ err }, "Pipeline failed")
  process.exit(1)
})