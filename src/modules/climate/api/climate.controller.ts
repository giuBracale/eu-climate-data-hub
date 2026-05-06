import * as repository from "@/modules/infrastructure/database/climate.repository"
import * as climateService from "@/modules/climate/application/climate.service"

import asyncHandler from "@/modules/shared/middleware/async.handler"
import AppError from "@/modules/shared/errors/app.error"

import {
  toClimateDataDto,
  toClimateDataListDto
} from "@/modules/climate/api/dto/climate-data-response.dto"

import { toClimateTrendDto } from "@/modules/climate/api/dto/climate-trend-response.dto"
import { toGetClimateDataRequestDto } from "@/modules/climate/api/dto/get-climate-data-request.dto"

import {
  validateCountry,
  validateYear
} from "@/modules/climate/api/climate.validator"

import { getInsights } from "@/modules/infrastructure/ai/ai-service"

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

    if (year === undefined) {
      throw new AppError("Year is required", 400)
    }

    const dataset = await repository.getByCountry(country)

    if (!dataset.length) {
      throw new AppError("No data found for this country", 404)
    }

    const record = climateService.getByYear(dataset, year)

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