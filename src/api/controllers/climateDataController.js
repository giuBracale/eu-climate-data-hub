const repository = require("../../infrastructure/database/climateRepository")
const climateService = require("../../domain/services/climateDataService")

const asyncHandler = require("../middleware/asyncHandler")
const AppError = require("../../domain/errors/AppError")

const {
  toClimateDataDto,
  toClimateDataListDto
} = require("../dto/climateDataDto")

const {
  toClimateTrendDto
} = require("../dto/climateTrendDto")

const {
  toGetClimateDataRequestDto
} = require("../dto/getClimateDataRequestDto")

const {
  validateCountry,
  validateYear
} = require("../validators/climateDataValidator")


// GET /api/countries/:country/climate-data
const getAllClimateData = asyncHandler(async (req, res) => {
  const { country } = toGetClimateDataRequestDto({
    country: req.params.country
  })

  validateCountry(country)

  const dataset = await repository.getByCountry(country)

  if (!dataset || dataset.length === 0) {
    throw new AppError("No data found for this country", 404)
  }

  res.json(toClimateDataListDto(dataset))
})

// GET /api/countries/:country/climate-data/:year
const getClimateDataByYear = asyncHandler(async (req, res) => {
  const { country, year } = toGetClimateDataRequestDto({
    country: req.params.country,
    year: req.params.year
  })

  validateCountry(country)
  validateYear(year)

  const dataset = await repository.getByCountry(country)

  if (!dataset || dataset.length === 0) {
    throw new AppError("No data found for this country", 404)
  }

  const record = climateService.getByYear(dataset, year)

  if (!record) {
    throw new AppError("Data not found for this year", 404)
  }

  res.json(toClimateDataDto(record))
})

// GET /api/countries/:country/climate-data/latest
const getLatestClimateData = asyncHandler(async (req, res) => {
  const { country } = toGetClimateDataRequestDto({
    country: req.params.country
  })

  validateCountry(country)

  const dataset = await repository.getByCountry(country)

  if (!dataset || dataset.length === 0) {
    throw new AppError("No data available", 404)
  }

  const latest = climateService.getLatest(dataset)

  if (!latest) {
    throw new AppError("No data available", 404)
  }

  res.json(toClimateDataDto(latest))
})

// GET /api/countries/:country/climate-data/trend
const getClimateTrend = asyncHandler(async (req, res) => {
  const { country } = toGetClimateDataRequestDto({
    country: req.params.country
  })

  validateCountry(country)

  const dataset = await repository.getByCountry(country)

  if (!dataset || dataset.length === 0) {
    throw new AppError("No data found for this country", 404)
  }

  const trend = climateService.getTrend(dataset)

  res.json(toClimateTrendDto(trend))
})

module.exports = {
  getAllClimateData,
  getClimateDataByYear,
  getLatestClimateData,
  getClimateTrend
}