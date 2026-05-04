import { runWorldBankPipeline } from "@pipelines/worldbankIngestion.pipeline"
import { countries } from "@config/countries"

async function run() {
  for (const country of countries) {
    console.log(` Fetching data for ${country}`)
    await runWorldBankPipeline(country)
  }

  console.log(" Pipeline completed")
}

run().catch(err => {
  console.error("Pipeline failed:", err)
  process.exit(1)
})