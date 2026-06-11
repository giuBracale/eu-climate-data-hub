import type { Request, RequestHandler, Response } from "express"

import {
  getAllClimateData,
  getClimateDataByYear,
  getClimateInsights,
  getClimateTrend,
  getLatestClimateData
} from "@/modules/climate/api/climate.controller"
import AppError from "@/modules/shared/errors/app.error"
import * as repository from "@/modules/infrastructure/database/climate.repository"
import { getInsights } from "@/modules/infrastructure/ai/ai-service"

jest.mock("@/modules/infrastructure/database/climate.repository", () => ({
  getByCountry: jest.fn()
}))

jest.mock("@/modules/infrastructure/ai/ai-service", () => ({
  getInsights: jest.fn()
}))

describe("Climate Controller", () => {
  const dataset = [
    { country: "ITA", year: 2000, gdp: 100, population: 10, co2: 5 },
    { country: "ITA", year: 2020, gdp: 200, population: 20, co2: 10 }
  ]

  const getByCountryMock = repository.getByCountry as jest.Mock
  const getInsightsMock = getInsights as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  async function runHandler(
    handler: RequestHandler,
    params: Record<string, string | undefined>
  ) {
    const req = { params } as unknown as Request
    const res = {
      json: jest.fn()
    } as unknown as Response
    const next = jest.fn()

    handler(req, res, next)
    await new Promise(resolve => setImmediate(resolve))

    return {
      json: res.json as jest.Mock,
      next
    }
  }

  function expectAppError(
    next: jest.Mock,
    message: string,
    statusCode: number
  ) {
    expect(next).toHaveBeenCalledWith(expect.any(AppError))

    const error = next.mock.calls[0][0] as AppError
    expect(error.message).toBe(message)
    expect(error.statusCode).toBe(statusCode)
  }

  it("returns all climate data for a valid country request", async () => {
    getByCountryMock.mockResolvedValue(dataset)

    const { json, next } = await runHandler(getAllClimateData, {
      country: "ita"
    })

    expect(getByCountryMock).toHaveBeenCalledWith("ITA")
    expect(json).toHaveBeenCalledWith([
      { country: "ITA", year: 2000, gdp: 100, population: 10, co2: 5 },
      { country: "ITA", year: 2020, gdp: 200, population: 20, co2: 10 }
    ])
    expect(next).not.toHaveBeenCalled()
  })

  it("rejects an invalid country before loading data", async () => {
    const { json, next } = await runHandler(getAllClimateData, {
      country: "ITALY"
    })

    expectAppError(next, "Invalid country code", 400)
    expect(getByCountryMock).not.toHaveBeenCalled()
    expect(json).not.toHaveBeenCalled()
  })

  it("returns not found when a country has no climate data", async () => {
    getByCountryMock.mockResolvedValue([])

    const { json, next } = await runHandler(getAllClimateData, {
      country: "ITA"
    })

    expectAppError(next, "No data found for this country", 404)
    expect(json).not.toHaveBeenCalled()
  })

  it("passes unexpected repository errors to Express error handling", async () => {
    const error = new Error("database unavailable")
    getByCountryMock.mockRejectedValue(error)

    const { json, next } = await runHandler(getAllClimateData, {
      country: "ITA"
    })

    expect(next).toHaveBeenCalledWith(error)
    expect(json).not.toHaveBeenCalled()
  })

  it("returns climate data for a valid year request", async () => {
    getByCountryMock.mockResolvedValue(dataset)

    const { json, next } = await runHandler(getClimateDataByYear, {
      country: "ITA",
      year: "2020"
    })

    expect(json).toHaveBeenCalledWith({
      country: "ITA",
      year: 2020,
      gdp: 200,
      population: 20,
      co2: 10
    })
    expect(next).not.toHaveBeenCalled()
  })

  it("rejects a non-integer year", async () => {
    const { json, next } = await runHandler(getClimateDataByYear, {
      country: "ITA",
      year: "2020.5"
    })

    expectAppError(next, "Invalid year", 400)
    expect(getByCountryMock).not.toHaveBeenCalled()
    expect(json).not.toHaveBeenCalled()
  })

  it("rejects a missing year for the by-year handler", async () => {
    const { json, next } = await runHandler(getClimateDataByYear, {
      country: "ITA",
      year: undefined
    })

    expectAppError(next, "Year is required", 400)
    expect(getByCountryMock).not.toHaveBeenCalled()
    expect(json).not.toHaveBeenCalled()
  })

  it("returns not found for by-year requests when the dataset is empty", async () => {
    getByCountryMock.mockResolvedValue([])

    const { json, next } = await runHandler(getClimateDataByYear, {
      country: "ITA",
      year: "2020"
    })

    expectAppError(next, "No data found for this country", 404)
    expect(json).not.toHaveBeenCalled()
  })

  it("returns not found when the requested year is absent", async () => {
    getByCountryMock.mockResolvedValue(dataset)

    const { json, next } = await runHandler(getClimateDataByYear, {
      country: "ITA",
      year: "1999"
    })

    expectAppError(next, "Data not found for this year", 404)
    expect(json).not.toHaveBeenCalled()
  })

  it("returns the latest climate data for a valid request", async () => {
    getByCountryMock.mockResolvedValue(dataset)

    const { json, next } = await runHandler(getLatestClimateData, {
      country: "ITA"
    })

    expect(json).toHaveBeenCalledWith({
      country: "ITA",
      year: 2020,
      gdp: 200,
      population: 20,
      co2: 10
    })
    expect(next).not.toHaveBeenCalled()
  })

  it("returns not found when latest data has an empty dataset", async () => {
    getByCountryMock.mockResolvedValue([])

    const { json, next } = await runHandler(getLatestClimateData, {
      country: "ITA"
    })

    expectAppError(next, "No data available", 404)
    expect(json).not.toHaveBeenCalled()
  })

  it("returns not found when no latest valid record exists", async () => {
    getByCountryMock.mockResolvedValue([
      { country: "ITA", year: 2020, gdp: null, population: null, co2: null }
    ])

    const { json, next } = await runHandler(getLatestClimateData, {
      country: "ITA"
    })

    expectAppError(next, "No data available", 404)
    expect(json).not.toHaveBeenCalled()
  })

  it("returns trend data for a valid request", async () => {
    getByCountryMock.mockResolvedValue(dataset)

    const { json, next } = await runHandler(getClimateTrend, {
      country: "ITA"
    })

    expect(json).toHaveBeenCalledWith({
      period: "2000-2020",
      gdpGrowth: 100,
      populationGrowth: 100,
      co2Change: 100
    })
    expect(next).not.toHaveBeenCalled()
  })

  it("returns not found when trend data has an empty dataset", async () => {
    getByCountryMock.mockResolvedValue([])

    const { json, next } = await runHandler(getClimateTrend, {
      country: "ITA"
    })

    expectAppError(next, "No data found for this country", 404)
    expect(json).not.toHaveBeenCalled()
  })

  it("returns AI climate insights for a valid request", async () => {
    getByCountryMock.mockResolvedValue(dataset)
    getInsightsMock.mockResolvedValue({ insight: "Emissions doubled." })

    const { json, next } = await runHandler(getClimateInsights, {
      country: "ITA"
    })

    expect(getInsightsMock).toHaveBeenCalledWith("ITA", dataset)
    expect(json).toHaveBeenCalledWith({
      country: "ITA",
      insight: "Emissions doubled."
    })
    expect(next).not.toHaveBeenCalled()
  })

  it("returns not found when insight data has an empty dataset", async () => {
    getByCountryMock.mockResolvedValue([])

    const { json, next } = await runHandler(getClimateInsights, {
      country: "ITA"
    })

    expectAppError(next, "No data found for this country", 404)
    expect(getInsightsMock).not.toHaveBeenCalled()
    expect(json).not.toHaveBeenCalled()
  })

  it("passes unexpected AI errors to Express error handling", async () => {
    const error = new Error("AI service unavailable")
    getByCountryMock.mockResolvedValue(dataset)
    getInsightsMock.mockRejectedValue(error)

    const { json, next } = await runHandler(getClimateInsights, {
      country: "ITA"
    })

    expect(next).toHaveBeenCalledWith(error)
    expect(json).not.toHaveBeenCalled()
  })
})
