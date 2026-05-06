import { prisma } from "./prisma.client"

export async function getMetrics(country: string) {
  return prisma.climateMetrics.findUnique({
    where: { country }
  })
}

export async function upsertMetrics(
  country: string,
  data: any
) {
  return prisma.climateMetrics.upsert({
    where: { country },
    update: data,
    create: {
      country,
      ...data
    }
  })
}