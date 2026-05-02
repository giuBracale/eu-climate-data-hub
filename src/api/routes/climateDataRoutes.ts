import express from "express"
import * as controller from "../controllers/climateDataController"

const router = express.Router()

router.get(
  "/countries/:country/climate-data",
  controller.getAllClimateData
)

router.get(
  "/countries/:country/climate-data/latest",
  controller.getLatestClimateData
)

router.get(
  "/countries/:country/climate-data/trend",
  controller.getClimateTrend
)

router.get(
  "/countries/:country/climate-data/year/:year",
  controller.getClimateDataByYear
)

router.get(
  "/countries/:country/climate-data/insights",
  controller.getClimateInsights
)

export default router