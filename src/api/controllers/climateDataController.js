const repository = require("../../infrastructure/storage/fileRepository")
const climateService = require("../../domain/services/climateDataService")

function getAllClimateData(req, res) {
  const { country } = req.params

  const dataset = repository.getDataset(country)

  res.json(dataset)
}

function getClimateDataByYear(req, res) {
  const { country, year } = req.params

  const dataset = repository.getDataset(country)
  const record = climateService.getByYear(dataset, year)

  if (!record) {
    return res.status(404).json({ error: "Data not found" })
  }

  res.json(record)
}

function getLatestClimateData(req, res) {
  const { country } = req.params

  const dataset = repository.getDataset(country)
  const latest = climateService.getLatest(dataset)

  res.json(latest)
}

function getClimateTrend(req, res) {
  const { country } = req.params

  const dataset = repository.getDataset(country)
  const trend = climateService.getTrend(dataset)

  res.json(trend)
}

module.exports = {
  getAllClimateData,
  getClimateDataByYear,
  getLatestClimateData,
  getClimateTrend
}