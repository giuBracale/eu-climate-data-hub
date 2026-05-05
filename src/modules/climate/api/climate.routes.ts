import { Router } from "express"

import {
  getAllClimateData,
  getClimateDataByYear,
  getLatestClimateData,
  getClimateTrend,
  getClimateInsights
} from "@/modules/climate/api/climate.controller"

const router = Router()

router.get("/countries/:country/climate-data", getAllClimateData)
router.get("/countries/:country/climate-data/latest", getLatestClimateData)
router.get("/countries/:country/climate-data/trend", getClimateTrend)
router.get("/countries/:country/climate-data/year/:year", getClimateDataByYear)
router.get("/countries/:country/insights", getClimateInsights)

export default router