
type ClimateRecord = {
  year: string | number
  gdp?: number | null
  population?: number | null
  co2?: number | null
  gdpValue?: number | null
  populationValue?: number | null
  co2Value?: number | null
}

type AIResponse = {
  insight: string
}

export async function getInsights(
  country: string,
  dataset: ClimateRecord[]
): Promise<AIResponse> {
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

    return (await response.json()) as AIResponse
  } catch (error) {
    console.error("AI Service call failed:", (error as Error).message)
    throw new Error("Failed to fetch AI insights")
  }
}