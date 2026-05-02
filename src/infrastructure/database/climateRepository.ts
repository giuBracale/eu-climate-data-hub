import prisma from "./prismaClient"

type ClimateRecord = {
  country: string
  year: string | number
  gdp?: number | null
  population?: number | null
  co2?: number | null
}

export async function saveMany(records: ClimateRecord[]): Promise<void> {
  if (!records.length) return

  await prisma.climateData.createMany({
    data: records.map(r => ({
      country: r.country,
      year: Number(r.year),
      gdp: r.gdp ?? null,
      population: r.population ?? null,
      co2: r.co2 ?? null
    })),
    skipDuplicates: true
  })
}

export async function getByCountry(
  country: string
): Promise<ClimateRecord[]> {
  return prisma.climateData.findMany({
    where: { country },
    orderBy: { year: "asc" }
  })
}