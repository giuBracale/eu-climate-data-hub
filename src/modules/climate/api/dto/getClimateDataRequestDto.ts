import AppError from "@/modules/shared/errors/AppError"
export interface GetClimateDataRequestDto {
  country: string
  year?: number
}

export type RawParams = {
  country?: string
  year?: string
}

export function toGetClimateDataRequestDto(
  params: RawParams
): GetClimateDataRequestDto {
  const year = params.year ? Number(params.year) : undefined


  if (params.year && Number.isNaN(year)) {
    throw new AppError("Invalid year", 400)
  }

  const country = (params.country ?? "").toUpperCase()

  if (!country) {
    throw new Error("Country is required")
  }

  return {
    country,
    ...(year !== undefined && { year })
  }
}

