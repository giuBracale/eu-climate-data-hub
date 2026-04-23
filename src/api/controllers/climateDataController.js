const repository = require("../../infrastructure/database/climateRepository")
const climateService = require("../../domain/services/climateDataService")

// GET /api/countries/:country/climate-data
async function getAllClimateData(req, res) {
  const { country } = req.params

  try {
    const dataset = await repository.getByCountry(country)

    if (!dataset || dataset.length === 0) {
      return res.status(404).json({ error: "No data found for this country" })
    }

    res.json(dataset)
  } catch (err) {
    console.error("Error fetching climate data:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

// GET /api/countries/:country/climate-data/:year
async function getClimateDataByYear(req, res) {
  const { country, year } = req.params

  try {
    const dataset = await repository.getByCountry(country)
    const record = climateService.getByYear(dataset, year)

    if (!record) {
      return res.status(404).json({ error: "Data not found for this year" })
    }

    res.json(record)
  } catch (err) {
    console.error("Error fetching data by year:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

// GET /api/countries/:country/climate-data/latest
async function getLatestClimateData(req, res) {
  const { country } = req.params

  try {
    const dataset = await repository.getByCountry(country)
    const latest = climateService.getLatest(dataset)

    if (!latest) {
      return res.status(404).json({ error: "No data available" })
    }

    res.json(latest)
  } catch (err) {
    console.error("Error fetching latest data:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

// GET /api/countries/:country/climate-data/trend
async function getClimateTrend(req, res) {
  const { country } = req.params

  try {
    const dataset = await repository.getByCountry(country)
    const trend = climateService.getTrend(dataset)

    res.json(trend)
  } catch (err) {
    console.error("Error fetching trend data:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = {
  getAllClimateData,
  getClimateDataByYear,
  getLatestClimateData,
  getClimateTrend
}