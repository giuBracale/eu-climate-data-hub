function toGetClimateDataRequestDto(params) {
  return {
    country: params.country?.toUpperCase(),
    year: params.year
  }
}

module.exports = {
  toGetClimateDataRequestDto
}