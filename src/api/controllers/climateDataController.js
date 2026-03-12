const climateDataService = require("../../services/climateDataService")

function getAllClimateData(req, res) {

  const { country } = req.params

  const dataset = climateDataService.getDataset(country)

  res.json(dataset)

}

function getClimateDataByYear(req, res) {

  const { country, year } = req.params

  const record = climateDataService.getByYear(country, year)

  if (!record) {
    return res.status(404).json({ error: "Data not found" })
  }

  res.json(record)

}

function getLatestClimateData(req, res) {

  const { country } = req.params

  const latest = climateDataService.getLatest(country)

  res.json(latest)

}

function getClimateTrend(req, res) {

  const { country } = req.params

  const trend = climateDataService.getTrend(country)

  res.json(trend)

}

module.exports = {
  getAllClimateData,
  getClimateDataByYear,
  getLatestClimateData,
  getClimateTrend
}