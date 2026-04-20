const fs = require("fs")
const path = require("path")

function getFilePath(country) {
  return path.join(
    __dirname,
    `../../../data/processed/climate_${country}.json`
  )
}

function getDataset(country) {
  const filePath = getFilePath(country)
  const raw = fs.readFileSync(filePath)
  return JSON.parse(raw)
}

module.exports = {
  getDataset
}