import { ClimateRecord } from "@/types/types"

function sortByYearAsc(data: ClimateRecord[]): ClimateRecord[] {
  return [...data].sort((a, b) => a.year - b.year)
}

function sortByYearDesc(data: ClimateRecord[]): ClimateRecord[] {
  return [...data].sort((a, b) => b.year - a.year)
}

function filterValidData(data: ClimateRecord[]): ClimateRecord[] {
  return data.filter(
    d =>
      d.gdp !== null && d.gdp !== undefined ||
      d.population !== null && d.population !== undefined ||
      d.co2 !== null && d.co2 !== undefined
  )
}

export function getLatest(dataset: ClimateRecord[]): ClimateRecord | undefined {
  const valid = filterValidData(dataset)
  if (!valid.length) return undefined
  return sortByYearDesc(valid)[0]
}

export function getByYear(
  dataset: ClimateRecord[],
  year: number
): ClimateRecord | undefined {
  return dataset.find(record => record.year === year)
}

export function getTrend(dataset: ClimateRecord[]) {
  const valid = sortByYearAsc(filterValidData(dataset))
  if (valid.length < 2) return null

  const first = valid[0]!
  const last = valid[valid.length - 1]!

  const computeGrowth = (
    firstVal?: number | null,
    lastVal?: number | null
  ): number | null => {
    if (firstVal == null || lastVal == null || firstVal === 0) return null
    return ((lastVal - firstVal) / firstVal) * 100
  }

  return {
    period: `${first.year}-${last.year}`,
    gdp_growth: computeGrowth(first.gdp, last.gdp),
    population_growth: computeGrowth(first.population, last.population),
    co2_change: computeGrowth(first.co2, last.co2)
  }
}