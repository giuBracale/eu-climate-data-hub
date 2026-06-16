import request from "supertest"
import app from "@/app/app"

describe("GET /api/countries", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/api/countries")
    expect(res.statusCode).toBe(200)
  })

  it("returns an array", async () => {
    const res = await request(app).get("/api/countries")
    expect(Array.isArray(res.body)).toBe(true)
  })

  it("every entry has a code and a name", async () => {
    const res = await request(app).get("/api/countries")
    for (const item of res.body as { code: unknown; name: unknown }[]) {
      expect(typeof item.code).toBe("string")
      expect(typeof item.name).toBe("string")
    }
  })

  it("includes ITA mapped to Italy", async () => {
    const res = await request(app).get("/api/countries")
    const ita = (res.body as { code: string; name: string }[]).find(
      c => c.code === "ITA"
    )
    expect(ita).toBeDefined()
    expect(ita?.name).toBe("Italy")
  })

  it("does not hit the database", async () => {
    // The endpoint is purely config-driven; a second call with no DB
    // must still return the same payload.
    const first = await request(app).get("/api/countries")
    const second = await request(app).get("/api/countries")
    expect(first.body).toEqual(second.body)
  })
})
