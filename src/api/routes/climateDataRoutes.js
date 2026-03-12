const express = require("express")
const controller = require("../controllers/climateDataController")

const router = express.Router()

/**
 * @swagger
 * /countries/{country}/climate-data:
 *   get:
 *     summary: Get all climate data for a country
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         example: ITA
 *     responses:
 *       200:
 *         description: List of climate data records
 */
router.get(
  "/countries/:country/climate-data",
  controller.getAllClimateData
)

/**
 * @swagger
 * /countries/{country}/climate-data/latest:
 *   get:
 *     summary: Get latest climate data for a country
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Latest available record
 */
router.get(
  "/countries/:country/climate-data/latest",
  controller.getLatestClimateData
)

/**
 * @swagger
 * /countries/{country}/climate-data/trend:
 *   get:
 *     summary: Get long term climate trend
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trend data
 */
router.get(
  "/countries/:country/climate-data/trend",
  controller.getClimateTrend
)

/**
 * @swagger
 * /countries/{country}/climate-data/{year}:
 *   get:
 *     summary: Get climate data for a specific year
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1980
 *     responses:
 *       200:
 *         description: Climate data for the specified year
 */
router.get(
  "/countries/:country/climate-data/:year",
  controller.getClimateDataByYear
)

module.exports = router