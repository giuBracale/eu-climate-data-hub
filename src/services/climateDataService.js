const fs = require("fs")
const path = require("path")

function loadDataset(country) {

  const DATA_FILE = path.join(
    __dirname,
    `../../data/processed/climate_${country}.json`
  )

  const rawData = fs.readFileSync(DATA_FILE)

  return JSON.parse(rawData)

}

function getDataset(country) {
  return loadDataset(country)
}

function getByYear(country, year) {

  const dataset = loadDataset(country)

  return dataset.find(record => record.year === year)

}

function getLatest(country) {

  const dataset = loadDataset(country)

  const sorted = dataset
    .filter(d => d.gdp && d.population && d.co2)
    .sort((a, b) => Number(b.year) - Number(a.year))

  return sorted[0]

}

function getTrend(country) {

  const dataset = loadDataset(country)

  const sorted = dataset
    .filter(d => d.gdp && d.population && d.co2)
    .sort((a, b) => Number(a.year) - Number(b.year))

  const first = sorted[0]
  const last = sorted[sorted.length - 1]

  return {
    country,
    period: `${first.year}-${last.year}`,
    gdp_growth: last.gdp - first.gdp,
    population_growth: last.population - first.population,
    co2_change: last.co2 - first.co2
  }

}

module.exports = {
  getDataset,
  getByYear,
  getLatest,
  getTrend
}