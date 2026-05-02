const request = require("supertest")
const app = require("../../src/app/app").default

describe("Validation", () => {

  test("should fail with invalid country", async () => {
    const res = await request(app)
      .get("/api/countries/INVALID/climate-data")

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty("error")
  })

  test("should fail with invalid year", async () => {
    const res = await request(app)
      .get("/api/countries/ITA/climate-data/year/abc")

    expect(res.statusCode).toBe(400)
  })

})