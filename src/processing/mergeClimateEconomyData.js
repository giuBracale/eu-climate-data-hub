const fs = require("fs")
const path = require("path")

const rawDir = path.join(__dirname, "../../data/raw")
const outputFile = path.join(__dirname, "../../data/processed/climate_economy_dataset.json")

function loadData(file) {
  const filePath = path.join(rawDir, file)
  return JSON.parse(fs.readFileSync(filePath))[1]
}

function mergeDatasets() {

  const gdpData = loadData("gdp.json")
  const populationData = loadData("population.json")
  const co2Data = loadData("co2.json")

  const dataset = {}

  function insert(data, field) {
    data.forEach(item => {
      const year = item.date

      if (!dataset[year]) {
        dataset[year] = { year }
      }

      dataset[year][field] = item.value
    })
  }

  insert(gdpData, "gdp")
  insert(populationData, "population")
  insert(co2Data, "co2")

  const result = Object.values(dataset)

  return result
}

function saveDataset(data) {

  const processedDir = path.join(__dirname, "../../data/processed")

  if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir)
  }

  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2))
}

function runProcessing() {

  const dataset = mergeDatasets()

  saveDataset(dataset)

  console.log("Processed dataset created")

}

module.exports = {
  runProcessing
}