const axios = require("axios")

const BASE_URL = "https://api.worldbank.org/v2/country"

async function fetchIndicator(country, indicator) {
  const url = `${BASE_URL}/${country}/indicator/${indicator}?format=json`
  const response = await axios.get(url)
  return response.data
}

module.exports = {
  fetchIndicator
}