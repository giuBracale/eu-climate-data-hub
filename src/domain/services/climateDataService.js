function filterValidData(dataset) {
  return dataset.filter(d => d.gdp && d.population && d.co2)
}

function sortByYearAsc(dataset) {
  return [...dataset].sort((a, b) => Number(a.year) - Number(b.year))
}

function sortByYearDesc(dataset) {
  return [...dataset].sort((a, b) => Number(b.year) - Number(a.year))
}

function getByYear(dataset, year) {
  return dataset.find(record => record.year === year)
}

function getLatest(dataset) {
  const valid = filterValidData(dataset)
  const sorted = sortByYearDesc(valid)
  return sorted[0]
}

function getTrend(dataset) {
  const valid = filterValidData(dataset)
  const sorted = sortByYearAsc(valid)

  if (sorted.length === 0) {
    return null
  }

  const first = sorted[0]
  const last = sorted[sorted.length - 1]

  return {
    period: `${first.year}-${last.year}`,
    gdp_growth: last.gdp - first.gdp,
    population_growth: last.population - first.population,
    co2_change: last.co2 - first.co2
  }
}

module.exports = {
  getByYear,
  getLatest,
  getTrend
}