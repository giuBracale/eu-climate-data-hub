/// <reference types="node" />
import { updateMetricsForCountry } from "../../src/processing/updateMetrics"
import fs from "fs"
import path from "path"

const RAW_DIR = path.join(__dirname, "../../data/raw")

async function run() {
  const countries = fs.readdirSync(RAW_DIR)

  for (const country of countries) {
    console.log(`→ Updating metrics for ${country}`)
    await updateMetricsForCountry(country)
  }

  console.log("Metrics update completed")
}

run().catch(err => {
  console.error("Metrics job failed:", err)
  process.exit(1)
})