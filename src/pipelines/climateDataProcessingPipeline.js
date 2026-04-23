const fs = require("fs")
const path = require("path")

const RAW_DIR = path.join(__dirname, "../../data/raw")
//const PROCESSED_DIR = path.join(__dirname, "../../data/processed")

const repository = require("../infrastructure/database/climateRepository")

function loadData(country, file) {
  const filePath = path.join(RAW_DIR, country, file)
  const raw = fs.readFileSync(filePath)
  return JSON.parse(raw)[1]
}

function mergeCountryData(country) {
  const gdpData = loadData(country, "gdp.json")
  const populationData = loadData(country, "population.json")
  const co2Data = loadData(country, "co2.json")

  const dataset = {}

  function insert(data, field) {
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
    d => d.gdp || d.population || d.co2
  )
}

async function runProcessing() {
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

      await repository.saveMany(dataset)

      console.log(`✔ Saved dataset to DB for ${country}\n`)
    } catch (err) {
      console.error(`✖ Error processing ${country}:`, err.message)
    }
  }

  console.log(" Processing completed\n")
}

module.exports = {
  runProcessing
}

//
//  RUNNER
//

if (require.main === module) {
  runProcessing()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}