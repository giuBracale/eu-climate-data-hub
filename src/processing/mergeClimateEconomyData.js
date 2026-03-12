const fs = require("fs")
const path = require("path")

const RAW_DIR = path.join(__dirname, "../../data/raw")
const PROCESSED_DIR = path.join(__dirname, "../../data/processed")

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
        dataset[year] = {
          country,
          year
        }
      }

      dataset[year][field] = item.value

    })

  }

  insert(gdpData, "gdp")
  insert(populationData, "population")
  insert(co2Data, "co2")

  return Object.values(dataset)

}

function runProcessing() {

  const countries = fs.readdirSync(RAW_DIR)

  fs.mkdirSync(PROCESSED_DIR, { recursive: true })

  countries.forEach(country => {

    const dataset = mergeCountryData(country)

    const outputFile = path.join(
      PROCESSED_DIR,
      `climate_${country}.json`
    )

    fs.writeFileSync(outputFile, JSON.stringify(dataset, null, 2))

    console.log(`Processed dataset created for ${country}`)

  })

}

module.exports = {
  runProcessing
}