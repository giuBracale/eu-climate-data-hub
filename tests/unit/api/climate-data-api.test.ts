import request from "supertest"
import app from "@/app/app"

describe("Climate Data API", () => {
  it("GET dataset for country", async () => {
    const res = await request(app)
      .get("/api/countries/ITA/climate-data")

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it("GET latest climate data", async () => {
    const res = await request(app)
      .get("/api/countries/ITA/climate-data/latest")

    expect([200, 404]).toContain(res.statusCode)
  })

  it("GET trend data", async () => {
    const res = await request(app)
      .get("/api/countries/ITA/climate-data/trend")

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("gdpGrowth")
    expect(res.body).toHaveProperty("populationGrowth")
    expect(res.body).toHaveProperty("co2Change")
  })

  it("GET unconfigured country should return 400", async () => {
    const res = await request(app)
      .get("/api/countries/XXX/climate-data")

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty("error")
  })

  it("GET out-of-range year should return 400", async () => {
    const res = await request(app)
      .get("/api/countries/ITA/climate-data/year/9999")

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty("error")
  })
})