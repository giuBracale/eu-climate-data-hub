import { Request, Response } from "express"

import * as repository from "../../infrastructure/database/climateRepository"
import * as climateService from "../../domain/services/climateDataService"

import asyncHandler from "../middleware/asyncHandler"
import AppError from "../../domain/errors/AppError"

import {
  toClimateDataDto,
  toClimateDataListDto
} from "../dto/climateDataDto"

import { toClimateTrendDto } from "../dto/climateTrendDto"
import { toGetClimateDataRequestDto } from "../dto/getClimateDataRequestDto"

import {
  validateCountry,
  validateYear
} from "../validators/climateDataValidator"

import { getInsights } from "../../infrastructure/ai/aiService"

//
// PARAM TYPES
//
type CountryParams = {
  country: string
}

type CountryYearParams = {
  country: string
  year: string
}

//
// GET ALL
//
export const getAllClimateData = asyncHandler<CountryParams>(
  async (req, res) => {
    const { country } = toGetClimateDataRequestDto({
      country: req.params.country
    })

    validateCountry(country)

    const dataset = await repository.getByCountry(country)

    if (!dataset.length) {
      throw new AppError("No data found for this country", 404)
    }

    res.json(toClimateDataListDto(dataset))
  }
)

//
// GET BY YEAR
//
export const getClimateDataByYear = asyncHandler<CountryYearParams>(
  async (req, res) => {
    const { country, year } = toGetClimateDataRequestDto({
      country: req.params.country,
      year: req.params.year
    })

    validateCountry(country)
    validateYear(year)

    const dataset = await repository.getByCountry(country)

    if (!dataset.length) {
      throw new AppError("No data found for this country", 404)
    }

    const record = climateService.getByYear(dataset, year!)

    if (!record) {
      throw new AppError("Data not found for this year", 404)
    }

    res.json(toClimateDataDto(record))
  }
)

//
// GET LATEST
//
export const getLatestClimateData = asyncHandler<CountryParams>(
  async (req, res) => {
    const { country } = toGetClimateDataRequestDto({
      country: req.params.country
    })

    validateCountry(country)

    const dataset = await repository.getByCountry(country)

    if (!dataset.length) {
      throw new AppError("No data available", 404)
    }

    const latest = climateService.getLatest(dataset)

    if (!latest) {
      throw new AppError("No data available", 404)
    }

    res.json(toClimateDataDto(latest))
  }
)

//
// GET TREND
//
export const getClimateTrend = asyncHandler<CountryParams>(
  async (req, res) => {
    const { country } = toGetClimateDataRequestDto({
      country: req.params.country
    })

    validateCountry(country)

    const dataset = await repository.getByCountry(country)

    if (!dataset.length) {
      throw new AppError("No data found for this country", 404)
    }

    const trend = climateService.getTrend(dataset)

    res.json(toClimateTrendDto(trend))
  }
)

//
// GET INSIGHTS (AI)
//
export const getClimateInsights = asyncHandler<CountryParams>(
  async (req, res) => {
    const { country } = toGetClimateDataRequestDto({
      country: req.params.country
    })

    validateCountry(country)

    const dataset = await repository.getByCountry(country)

    if (!dataset.length) {
      throw new AppError("No data found for this country", 404)
    }

    const aiResponse = await getInsights(country, dataset)

    res.json({
      country,
      insight: aiResponse.insight
    })
  }
)