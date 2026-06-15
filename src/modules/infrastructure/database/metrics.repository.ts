import { prisma } from "./prisma.client"

export type MetricsPayload = {
  gdp_growth_pct: number | null
  population_growth_pct: number | null
  co2_change_pct: number | null
  dataset_hash: string
  updated_at: Date
  data_points: number
  first_year: number
  last_year: number
}

export async function getMetrics(country: string) {
  return prisma.climateMetrics.findUnique({
    where: { country }
  })
}

export async function upsertMetrics(
  country: string,
  data: MetricsPayload
) {
  return prisma.climateMetrics.upsert({
    where: { country },
    update: data,
    create: {
      country,
      ...data
    }
  })
}