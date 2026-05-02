export type RawClimateRecord = {
  country: string
  year: string | number
  gdp?: number | null
  population?: number | null
  co2?: number | null
}

export interface ClimateDataDto {
  country: string
  year: string | number
  gdp: number | null
  population: number | null
  co2: number | null
}

export function toClimateDataDto(record: RawClimateRecord): ClimateDataDto {
  return {
    country: record.country,
    year: record.year,
    gdp: record.gdp ?? null,
    population: record.population ?? null,
    co2: record.co2 ?? null
  }
}

export function toClimateDataListDto(
  records: RawClimateRecord[]
): ClimateDataDto[] {
  return records.map(toClimateDataDto)
}