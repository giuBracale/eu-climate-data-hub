export type RawTrend = {
  period: string
  gdp_growth: number | null
  population_growth: number | null
  co2_change: number | null
}

export interface ClimateTrendDto {
  period: string
  gdpGrowth: number | null
  populationGrowth: number | null
  co2Change: number | null
}

export function toClimateTrendDto(
  trend: RawTrend | null
): ClimateTrendDto | null {
  if (!trend) return null

  return {
    period: trend.period,
    gdpGrowth: trend.gdp_growth ?? null,
    populationGrowth: trend.population_growth ?? null,
    co2Change: trend.co2_change ?? null
  }
}