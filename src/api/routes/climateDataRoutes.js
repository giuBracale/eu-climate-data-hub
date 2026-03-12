const express = require("express")
const controller = require("../controllers/climateDataController")

const router = express.Router()

router.get("/countries/:country/climate-data", controller.getAllClimateData)

router.get("/countries/:country/climate-data/latest", controller.getLatestClimateData)

router.get("/countries/:country/climate-data/trend", controller.getClimateTrend)

router.get("/countries/:country/climate-data/:year", controller.getClimateDataByYear)

module.exports = router