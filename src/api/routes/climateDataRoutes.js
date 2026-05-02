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
  "/countries/:country/climate-data/year/:year",
  controller.getClimateDataByYear
)


/**
 * @swagger
 * /countries/{country}/climate-data/insights:
 *   get:
 *     summary: Get AI-generated climate insights
 *     description: Returns AI-based analysis of climate data for a country
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         example: ITA
 *     responses:
 *       200:
 *         description: AI insights retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 country:
 *                   type: string
 *                 insight:
 *                   type: string
 *       404:
 *         description: No data found
 *       500:
 *         description: AI service error
 */
router.get(
  "/countries/:country/climate-data/insights",
  controller.getClimateInsights
)

module.exports = router