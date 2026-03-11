const express = require("express")
const controller = require("../controllers/climateDataController")

const router = express.Router()

router.get("/climate-data", controller.getAllClimateData)
router.get("/climate-data/:year", controller.getClimateDataByYear)

module.exports = router