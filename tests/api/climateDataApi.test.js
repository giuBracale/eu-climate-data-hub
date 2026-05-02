const request = require("supertest")
const app = require("../../src/app/app").default

describe("Climate Data API", () => {

  test("GET dataset for country", async () => {
    const res = await request(app)
      .get("/api/countries/ITA/climate-data")

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test("GET latest climate data", async () => {
    const res = await request(app)
      .get("/api/countries/ITA/climate-data/latest")

    expect([200, 404]).toContain(res.statusCode)
  })

  test("GET trend data", async () => {
    const res = await request(app)
      .get("/api/countries/ITA/climate-data/trend")

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("gdpGrowth")
    expect(res.body).toHaveProperty("populationGrowth")
    expect(res.body).toHaveProperty("co2Change")
  })

  test("GET invalid country should return 404", async () => {
    const res = await request(app)
      .get("/api/countries/XXX/climate-data")

    expect(res.statusCode).toBe(404)
    expect(res.body).toHaveProperty("error")
  })

  test("GET invalid year should return 404", async () => {
    const res = await request(app)
      .get("/api/countries/ITA/climate-data/year/9999")
    expect(res.statusCode).toBe(404)
    expect(res.body).toHaveProperty("error")
  })

})