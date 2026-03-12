const request = require("supertest")
const app = require("../../src/app/app")

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

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("year")

  })

  test("GET trend data", async () => {

    const res = await request(app)
      .get("/api/countries/ITA/climate-data/trend")

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("period")

  })

})