export type RawTrend = {
  period: string
  gdp_growth: number
  population_growth: number
  co2_change: number
}

export interface ClimateTrendDto {
  period: string
  gdpGrowth: number
  populationGrowth: number
  co2Change: number
}

export function toClimateTrendDto(
  trend: RawTrend | null
): ClimateTrendDto | null {
  if (!trend) return null

  return {
    period: trend.period,
    gdpGrowth: trend.gdp_growth,
    populationGrowth: trend.population_growth,
    co2Change: trend.co2_change
  }
}