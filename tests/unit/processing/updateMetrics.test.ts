import { updateMetricsForCountry } from "@processing/updateMetrics"

import * as climateRepo from "@db/climateRepository"
import * as metricsRepo from "@db/metricsRepository"
import * as hashUtils from "@utils/hash"

jest.mock("@db/climateRepository")
jest.mock("@db/metricsRepository")
jest.mock("@utils/hash")

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
    ;(hashUtils.computeHash as jest.Mock).mockReturnValue("same_hash")

    ;(metricsRepo.getMetrics as jest.Mock).mockResolvedValue({
      dataset_hash: "same_hash"
    })

    await updateMetricsForCountry(country)

    expect(metricsRepo.upsertMetrics).not.toHaveBeenCalled()
  })

  // -----------------------------------
  // 3. update corretto
  // -----------------------------------
  it("updates metrics when hash changes", async () => {
    ;(climateRepo.getByCountry as jest.Mock).mockResolvedValue(mockDataset)

    ;(hashUtils.computeHash as jest.Mock).mockReturnValue("new_hash")

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
        dataset_hash: "new_hash",
        data_points: 2,
        first_year: "2000",
        last_year: "2020"
      })
    )
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

    ;(hashUtils.computeHash as jest.Mock).mockReturnValue("new_hash")

    ;(metricsRepo.getMetrics as jest.Mock).mockResolvedValue(null)

    await updateMetricsForCountry(country)

    const call = (metricsRepo.upsertMetrics as jest.Mock).mock.calls[0][1]

    expect(call.gdp_growth_pct).toBeNull()
    expect(call.population_growth_pct).toBeNull()
    expect(call.co2_change_pct).toBe(100)
  })
})