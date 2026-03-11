const fs = require("fs")
const path = require("path")

const DATA_FILE = path.join(
  __dirname,
  "../../data/processed/climate_economy_dataset.json"
)

function loadDataset() {
  const rawData = fs.readFileSync(DATA_FILE)
  return JSON.parse(rawData)
}

function getDataset() {
  return loadDataset()
}

function getByYear(year) {
  const dataset = loadDataset()
  return dataset.find(record => record.year === year)
}

module.exports = {
  getDataset,
  getByYear
}