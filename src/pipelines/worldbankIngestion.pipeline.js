const indicators = require("../config/indicators")
const { fetchIndicator } = require("../infrastructure/worldbank/worldbankClient")
const fs = require("fs")
const path = require("path")

const RAW_DIR = path.join(__dirname, "../../data/raw")

function saveRawData(country, filename, data) {
  const dir = path.join(RAW_DIR, country)

  fs.mkdirSync(dir, { recursive: true })

  const filePath = path.join(dir, filename)

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

async function runWorldBankPipeline(country) {
  console.log(`\n Starting ingestion for ${country}...\n`)

  for (const [name, indicator] of Object.entries(indicators)) {
    try {
      console.log(`→ Fetching ${name}...`)

      const data = await fetchIndicator(country, indicator)

      saveRawData(country, `${name}.json`, data)

      console.log(`✔ Saved ${name} for ${country}\n`)
    } catch (error) {
      console.error(`✖ Error processing ${name} for ${country}:`, error.message)
    }
  }

  console.log(` Ingestion completed for ${country}\n`)
}

module.exports = {
  runWorldBankPipeline
}

//
//  RUNNER (esecuzione da CLI)
//

if (require.main === module) {
  const country = process.argv[2]

  if (!country) {
    console.error(" Please provide a country code (e.g. ITA)")
    process.exit(1)
  }

  runWorldBankPipeline(country)
    .then(() => {
      console.log(" Pipeline finished successfully")
      process.exit(0)
    })
    .catch((err) => {
      console.error(" Pipeline failed:", err)
      process.exit(1)
    })
}