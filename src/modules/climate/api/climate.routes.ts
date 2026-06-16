import { Router } from "express"

import {
  getAllClimateData,
  getClimateDataByYear,
  getLatestClimateData,
  getClimateTrend,
  getClimateInsights
} from "@/modules/climate/api/climate.controller"

import { getCountries } from "@/modules/climate/api/countries.controller"

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     ClimateData:
 *       type: object
 *       properties:
 *         country: { type: string, example: ITA }
 *         year:    { type: integer, example: 2020 }
 *         gdp:     { type: number, nullable: true }
 *         population: { type: number, nullable: true }
 *         co2:     { type: number, nullable: true }
 *     ClimateTrend:
 *       type: object
 *       properties:
 *         period:           { type: string, example: "2000-2020" }
 *         gdpGrowth:        { type: number, nullable: true }
 *         populationGrowth: { type: number, nullable: true }
 *         co2Change:        { type: number, nullable: true }
 *     Error:
 *       type: object
 *       properties:
 *         error: { type: string }
 *   parameters:
 *     country:
 *       in: path
 *       name: country
 *       required: true
 *       schema: { type: string, example: ITA }
 *       description: ISO 3166-1 alpha-3 country code (ITA, FRA, DEU, ESP, USA)
 *     year:
 *       in: path
 *       name: year
 *       required: true
 *       schema: { type: integer, example: 2020 }
 */

/**
 * @swagger
 * /countries/{country}/climate-data:
 *   get:
 *     summary: All climate records for a country
 *     tags: [Climate]
 *     parameters:
 *       - $ref: '#/components/parameters/country'
 *     responses:
 *       200:
 *         description: Array of climate data records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClimateData'
 *       400:
 *         description: Invalid or unconfigured country code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No data found for this country
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /countries:
 *   get:
 *     summary: List all supported countries
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: Array of country objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: ITA
 *                   name:
 *                     type: string
 *                     example: Italy
 *             example:
 *               - code: ITA
 *                 name: Italy
 *               - code: FRA
 *                 name: France
 *               - code: DEU
 *                 name: Germany
 *               - code: ESP
 *                 name: Spain
 *               - code: USA
 *                 name: United States
 */
router.get("/countries", getCountries)

router.get("/countries/:country/climate-data", getAllClimateData)

/**
 * @swagger
 * /countries/{country}/climate-data/latest:
 *   get:
 *     summary: Most recent climate record with at least one metric
 *     tags: [Climate]
 *     parameters:
 *       - $ref: '#/components/parameters/country'
 *     responses:
 *       200:
 *         description: Latest climate data record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClimateData'
 *       404:
 *         description: No data available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/countries/:country/climate-data/latest", getLatestClimateData)

/**
 * @swagger
 * /countries/{country}/climate-data/trend:
 *   get:
 *     summary: Growth trends between the first and last valid records
 *     tags: [Climate]
 *     parameters:
 *       - $ref: '#/components/parameters/country'
 *     responses:
 *       200:
 *         description: Trend percentages
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClimateTrend'
 *       404:
 *         description: No data found for this country
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/countries/:country/climate-data/trend", getClimateTrend)

/**
 * @swagger
 * /countries/{country}/climate-data/year/{year}:
 *   get:
 *     summary: Climate record for a specific year
 *     tags: [Climate]
 *     parameters:
 *       - $ref: '#/components/parameters/country'
 *       - $ref: '#/components/parameters/year'
 *     responses:
 *       200:
 *         description: Climate data for the requested year
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClimateData'
 *       400:
 *         description: Invalid year
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Data not found for this year
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/countries/:country/climate-data/year/:year", getClimateDataByYear)

/**
 * @swagger
 * /countries/{country}/insights:
 *   get:
 *     summary: AI-generated climate insights for a country
 *     tags: [Climate]
 *     parameters:
 *       - $ref: '#/components/parameters/country'
 *     responses:
 *       200:
 *         description: AI insight text
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 country: { type: string }
 *                 insight: { type: string }
 *       404:
 *         description: No data found for this country
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/countries/:country/insights", getClimateInsights)

export default router