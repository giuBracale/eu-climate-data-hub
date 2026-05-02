type ClimateRecord = {
  country: string
  year: string | number
  gdp?: number | null
  population?: number | null
  co2?: number | null
}

type ClimateTrend = {
  period: string
  gdp_growth: number
  population_growth: number
  co2_change: number
}

// 🔥 FIX: non usare truthy check
function filterValidData(dataset: ClimateRecord[]): ClimateRecord[] {
  return dataset.filter(
    d =>
      d.gdp !== null &&
      d.gdp !== undefined &&
      d.population !== null &&
      d.population !== undefined &&
      d.co2 !== null &&
      d.co2 !== undefined
  )
}

function sortByYearAsc(dataset: ClimateRecord[]): ClimateRecord[] {
  return [...dataset].sort(
    (a, b) => Number(a.year) - Number(b.year)
  )
}

function sortByYearDesc(dataset: ClimateRecord[]): ClimateRecord[] {
  return [...dataset].sort(
    (a, b) => Number(b.year) - Number(a.year)
  )
}

export function getByYear(
  dataset: ClimateRecord[],
  year: string
): ClimateRecord | undefined {
  return dataset.find(
    record => String(record.year) === String(year)
  )
}

export function getLatest(
  dataset: ClimateRecord[]
): ClimateRecord | undefined {
  const valid = filterValidData(dataset)
  const sorted = sortByYearDesc(valid)
  return sorted[0]
}

export function getTrend(
  dataset: ClimateRecord[]
): ClimateTrend | null {
  const valid = filterValidData(dataset)
  const sorted = sortByYearAsc(valid)

  if (sorted.length === 0) {
    return null
  }

  const first = sorted[0]
  const last = sorted[sorted.length - 1]

  if (!first || !last) {
    return null
  }

  return {
    period: `${first.year}-${last.year}`,
    gdp_growth: (last.gdp ?? 0) - (first.gdp ?? 0),
    population_growth:
      (last.population ?? 0) - (first.population ?? 0),
    co2_change: (last.co2 ?? 0) - (first.co2 ?? 0)
  }
}