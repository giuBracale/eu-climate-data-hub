import { logger } from "@/modules/shared/utils/logger"
import AppError from "@/modules/shared/errors/app.error"
import { ClimateRecord } from "@/types/types"

type AIResponse = {
  insight: string
}

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL ?? "http://localhost:8000"

export async function getInsights(
  country: string,
  dataset: ClimateRecord[]
): Promise<AIResponse> {
  try {
    const normalizedData = dataset.map(record => ({
      year: String(record.year),
      gdp: record.gdp,
      population: record.population,
      co2: record.co2
    }))

    const response = await fetch(`${AI_SERVICE_URL}/analyze`, {
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
    logger.error({ err: error }, "AI service call failed")
    throw new AppError("AI service unavailable", 503)
  }
}
