import {
  computeGrowth,
  updateMetricsForCountry
} from "@/modules/climate/application/use-cases/update-metrics.usecase"

import * as climateRepo from "@/modules/infrastructure/database/climate.repository"
import * as metricsRepo from "@/modules/infrastructure/database/metrics.repository"
import { computeHash as computeDatasetHash } from "@/modules/shared/utils/hash"

jest.mock("@db/climate.repository")
jest.mock("@db/metrics.repository")

describe("updateMetricsForCountry", () => {
  const country = "ITA"

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockDataset = [
    { year: "2000", gdp: 100, population: 1000, co2: 10 },
    { year: "2020", gdp: 200, population: 2000, co2: 20 }
  ]

  // -----------------------------------
  // 1. dataset vuoto
  // -----------------------------------
  it("returns early if dataset is empty", async () => {
    ;(climateRepo.getByCountry as jest.Mock).mockResolvedValue([])

    await updateMetricsForCountry(country)

    expect(metricsRepo.upsertMetrics).not.toHaveBeenCalled()
  })

  // -----------------------------------
  // 2. hash uguale → skip
  // -----------------------------------
  it("skips update if dataset hash is unchanged", async () => {
    ;(climateRepo.getByCountry as jest.Mock).mockResolvedValue(mockDataset)
    const datasetHash = computeDatasetHash(mockDataset as never)

    ;(metricsRepo.getMetrics as jest.Mock).mockResolvedValue({
      dataset_hash: datasetHash
    })

    await updateMetricsForCountry(country)

    expect(metricsRepo.upsertMetrics).not.toHaveBeenCalled()
  })

  // -----------------------------------
  // 3. update corretto
  // -----------------------------------
  it("updates metrics when hash changes", async () => {
    ;(climateRepo.getByCountry as jest.Mock).mockResolvedValue(mockDataset)
    const datasetHash = computeDatasetHash(mockDataset as never)

    ;(metricsRepo.getMetrics as jest.Mock).mockResolvedValue({
      dataset_hash: "old_hash"
    })

    await updateMetricsForCountry(country)

    expect(metricsRepo.upsertMetrics).toHaveBeenCalledWith(
      country,
      expect.objectContaining({
        gdp_growth_pct: 100,
        population_growth_pct: 100,
        co2_change_pct: 100,
        dataset_hash: datasetHash,
        data_points: 2,
        first_year: "2000",
        last_year: "2020"
      })
    )
  })

  it("updates metrics for a single-record dataset", async () => {
    const singleRecordDataset = [
      { year: 2020, gdp: 100, population: 1000, co2: 10 }
    ]

    ;(climateRepo.getByCountry as jest.Mock).mockResolvedValue(
      singleRecordDataset
    )
    const datasetHash = computeDatasetHash(singleRecordDataset as never)
    ;(metricsRepo.getMetrics as jest.Mock).mockResolvedValue(null)

    await updateMetricsForCountry(country)

    expect(metricsRepo.upsertMetrics).toHaveBeenCalledWith(
      country,
      expect.objectContaining({
        gdp_growth_pct: 0,
        population_growth_pct: 0,
        co2_change_pct: 0,
        dataset_hash: datasetHash,
        data_points: 1,
        first_year: 2020,
        last_year: 2020
      })
    )
  })

  it("returns before hashing when the first record is missing", async () => {
    ;(climateRepo.getByCountry as jest.Mock).mockResolvedValue([undefined])

    await updateMetricsForCountry(country)

    expect(metricsRepo.getMetrics).not.toHaveBeenCalled()
    expect(metricsRepo.upsertMetrics).not.toHaveBeenCalled()
  })

  it("returns before hashing when the last record is missing", async () => {
    ;(climateRepo.getByCountry as jest.Mock).mockResolvedValue([
      { year: 2020, gdp: 100, population: 1000, co2: 10 },
      undefined
    ])

    await updateMetricsForCountry(country)

    expect(metricsRepo.getMetrics).not.toHaveBeenCalled()
    expect(metricsRepo.upsertMetrics).not.toHaveBeenCalled()
  })

  // -----------------------------------
  // 4. gestione valori null
  // -----------------------------------
  it("handles null values correctly", async () => {
    const datasetWithNull = [
      { year: "2000", gdp: null, population: 1000, co2: 10 },
      { year: "2020", gdp: 200, population: null, co2: 20 }
    ]

    ;(climateRepo.getByCountry as jest.Mock).mockResolvedValue(datasetWithNull)

    ;(metricsRepo.getMetrics as jest.Mock).mockResolvedValue(null)

    await updateMetricsForCountry(country)

    const call = (metricsRepo.upsertMetrics as jest.Mock).mock.calls[0][1]

    expect(call.gdp_growth_pct).toBeNull()
    expect(call.population_growth_pct).toBeNull()
    expect(call.co2_change_pct).toBe(100)
  })
})

describe("computeGrowth", () => {
  it("calculates positive, flat, and negative growth", () => {
    expect(computeGrowth(100, 200)).toBe(100)
    expect(computeGrowth(100, 100)).toBe(0)
    expect(computeGrowth(200, 100)).toBe(-50)
  })

  it("returns null when growth cannot be calculated", () => {
    expect(computeGrowth(null, 100)).toBeNull()
    expect(computeGrowth(undefined, 100)).toBeNull()
    expect(computeGrowth(100, null)).toBeNull()
    expect(computeGrowth(100, undefined)).toBeNull()
    expect(computeGrowth(0, 100)).toBeNull()
  })
})
