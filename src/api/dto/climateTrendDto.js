function toClimateTrendDto(trend) {
  if (!trend) return null

  return {
    period: trend.period,
    gdpGrowth: trend.gdp_growth,
    populationGrowth: trend.population_growth,
    co2Change: trend.co2_change
  }
}

module.exports = {
  toClimateTrendDto
}