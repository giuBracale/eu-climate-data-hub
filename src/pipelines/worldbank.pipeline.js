const indicators = require("../config/indicators")
const { fetchIndicator } = require("../services/worldbankService")
const { saveRawData } = require("../storage/fileStorage")

async function runWorldBankPipeline(country) {

  for (const [name, indicator] of Object.entries(indicators)) {

    try {

      const data = await fetchIndicator(country, indicator)

      saveRawData(country, `${name}.json`, data)

      console.log(`Saved ${name} for ${country}`)

    } catch (error) {

      console.error(`Error processing ${name} for ${country}`, error.message)

    }

  }

}

module.exports = {
  runWorldBankPipeline
}