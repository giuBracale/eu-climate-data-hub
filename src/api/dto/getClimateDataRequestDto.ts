export interface GetClimateDataRequestDto {
  country: string
  year?: string
}

export type RawParams = {
  country?: string
  year?: string
}

export function toGetClimateDataRequestDto(
  params: RawParams
): GetClimateDataRequestDto {
  return {
    country: (params.country ?? "").toUpperCase(),
    ...(params.year !== undefined && { year: params.year })
  }
}