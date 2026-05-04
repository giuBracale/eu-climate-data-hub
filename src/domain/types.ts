export type ClimateRecord = {
  country: string
  year: number
  gdp: number | null
  population: number | null
  co2: number | null
}

export type Metrics = {
  country: string
  gdp_growth_pct: number | null
  population_growth_pct: number | null
  co2_change_pct: number | null
  dataset_hash: string
  first_year: number
  last_year: number
  data_points: number
}