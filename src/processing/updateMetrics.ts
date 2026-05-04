import { getByCountry } from "../infrastructure/database/climateRepository"
import { getMetrics, upsertMetrics } from "../infrastructure/database/metricsRepository"
import { computeHash } from "../utils/hash"
import { logger } from "@utils/logger"

function computeGrowth(
  first: number | null | undefined,
  last: number | null | undefined
): number | null {
  if (first == null || last == null || first === 0) return null
  return ((last - first) / first) * 100
}

export async function updateMetricsForCountry(country: string) {
  const dataset = await getByCountry(country)

  if (dataset.length === 0) {
    logger.warn({ country }, "No data available")
    return
  }

  const [first, ...rest] = dataset
  const last = rest.length > 0 ? rest[rest.length - 1] : first

  if (!first || !last) return

  const newHash = computeHash(dataset)

  const existing = await getMetrics(country)

  if (existing?.dataset_hash === newHash) {
    logger.info({ country }, "Skipping country, no changes")
    return
  }

  const gdpGrowth = computeGrowth(first.gdp, last.gdp)
  const populationGrowth = computeGrowth(first.population, last.population)
  const co2Change = computeGrowth(first.co2, last.co2)

  await upsertMetrics(country, {
    gdp_growth_pct: gdpGrowth,
    population_growth_pct: populationGrowth,
    co2_change_pct: co2Change,
    dataset_hash: newHash,
    updated_at: new Date(),
    data_points: dataset.length,
    first_year: first.year,
    last_year: last.year
  })

  logger.info({ country }, "Metrics updated")
}