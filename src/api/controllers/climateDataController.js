const climateDataService = require("../../services/climateDataService")

function getAllClimateData(req, res) {
  const dataset = climateDataService.getDataset()
  res.json(dataset)
}

function getClimateDataByYear(req, res) {
  const { year } = req.params

  const record = climateDataService.getByYear(year)

  if (!record) {
    return res.status(404).json({
      error: "Year not found"
    })
  }

  res.json(record)
}

module.exports = {
  getAllClimateData,
  getClimateDataByYear
}