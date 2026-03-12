const { runWorldBankPipeline } = require("../src/pipelines/worldbank.pipeline")
const countries = require("../src/config/countries")

async function runPipeline() {

  for (const country of countries) {

    console.log(`Fetching data for ${country}`)

    await runWorldBankPipeline(country)

  }

}

runPipeline()