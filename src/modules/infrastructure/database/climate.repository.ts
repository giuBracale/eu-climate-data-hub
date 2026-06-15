import { prisma } from "./prisma.client"
import { ClimateData } from "@prisma/client"
import { ClimateRecord } from "@/types/types"

export async function saveMany(records: ClimateRecord[]): Promise<void> {
  if (!records.length) return

  await prisma.climateData.createMany({
    data: records.map(r => ({
      country: r.country,
      year: r.year,
      gdp: r.gdp,
      population: r.population,
      co2: r.co2
    })),
    skipDuplicates: true
  })
}

export async function getByCountry(
  country: string
): Promise<ClimateData[]> {
  return prisma.climateData.findMany({
    where: { country },
    orderBy: { year: "asc" }
  })
}