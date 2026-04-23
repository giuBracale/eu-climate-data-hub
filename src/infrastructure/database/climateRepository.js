const prisma = require("./prismaClient")

async function saveMany(records) {
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

async function getByCountry(country) {
  return prisma.climateData.findMany({
    where: { country },
    orderBy: { year: "asc" }
  })
}

module.exports = {
  saveMany,
  getByCountry
}