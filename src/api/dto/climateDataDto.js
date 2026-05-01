function toClimateDataDto(record) {
  return {
    country: record.country,
    year: record.year,
    gdp: record.gdp,
    population: record.population,
    co2: record.co2
  }
}

function toClimateDataListDto(records) {
  return records.map(toClimateDataDto)
}

module.exports = {
  toClimateDataDto,
  toClimateDataListDto
}