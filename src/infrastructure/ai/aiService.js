const fetch = require("node-fetch")

async function getInsights(country, dataset) {
  try {
    const normalizedData = dataset.map(record => ({
      year: String(record.year),
      gdp: record.gdp ?? record.gdpValue ?? null,
      population: record.population ?? record.populationValue ?? null,
      co2: record.co2 ?? record.co2Value ?? null
    }))

    const response = await fetch("http://ai-processor:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        country,
        data: normalizedData
      })
    })

    if (!response.ok) {
      throw new Error(`AI service error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("AI Service call failed:", error.message)
    throw new Error("Failed to fetch AI insights")
  }
}

module.exports = {
  getInsights
}