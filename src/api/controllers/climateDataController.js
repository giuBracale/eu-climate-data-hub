const repository = require("../../infrastructure/database/climateRepository")
const climateService = require("../../domain/services/climateDataService")

const asyncHandler = require("../middleware/asyncHandler")
const AppError = require("../../domain/errors/AppError")

// GET /api/countries/:country/climate-data
const getAllClimateData = asyncHandler(async (req, res) => {
  const { country } = req.params

  const dataset = await repository.getByCountry(country)

  if (!dataset || dataset.length === 0) {
    throw new AppError("No data found for this country", 404)
  }

  res.json(dataset)
})

// GET /api/countries/:country/climate-data/:year
const getClimateDataByYear = asyncHandler(async (req, res) => {
  const { country, year } = req.params

  const dataset = await repository.getByCountry(country)
  const record = climateService.getByYear(dataset, year)

  if (!record) {
    throw new AppError("Data not found for this year", 404)
  }

  res.json(record)
})

// GET /api/countries/:country/climate-data/latest
const getLatestClimateData = asyncHandler(async (req, res) => {
  const { country } = req.params

  const dataset = await repository.getByCountry(country)
  const latest = climateService.getLatest(dataset)

  if (!latest) {
    throw new AppError("No data available", 404)
  }

  res.json(latest)
})

// GET /api/countries/:country/climate-data/trend
const getClimateTrend = asyncHandler(async (req, res) => {
  const { country } = req.params

  const dataset = await repository.getByCountry(country)

  if (!dataset || dataset.length === 0) {
    throw new AppError("No data found for this country", 404)
  }

  const trend = climateService.getTrend(dataset)

  res.json(trend)
})

module.exports = {
  getAllClimateData,
  getClimateDataByYear,
  getLatestClimateData,
  getClimateTrend
}