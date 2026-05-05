import axios from "axios"

const BASE_URL = "https://api.worldbank.org/v2/country"

type WorldBankResponse = any // migliorabile dopo

export async function fetchIndicator(
  country: string,
  indicator: string
): Promise<WorldBankResponse> {
  const url = `${BASE_URL}/${country}/indicator/${indicator}?format=json`

  const response = await axios.get<WorldBankResponse>(url)

  return response.data
}