import { getCountries } from "@/modules/climate/application/countries.service"

describe("getCountries", () => {
  it("returns a non-empty array", () => {
    expect(getCountries().length).toBeGreaterThan(0)
  })

  it("every entry has a string code and a string name", () => {
    for (const country of getCountries()) {
      expect(typeof country.code).toBe("string")
      expect(typeof country.name).toBe("string")
      expect(country.code.length).toBeGreaterThan(0)
      expect(country.name.length).toBeGreaterThan(0)
    }
  })

  it("includes all configured countries", () => {
    const codes = getCountries().map(c => c.code)
    expect(codes).toContain("ITA")
    expect(codes).toContain("FRA")
    expect(codes).toContain("DEU")
    expect(codes).toContain("ESP")
    expect(codes).toContain("USA")
  })

  it("maps codes to the correct names", () => {
    const byCode = Object.fromEntries(getCountries().map(c => [c.code, c.name]))
    expect(byCode["ITA"]).toBe("Italy")
    expect(byCode["FRA"]).toBe("France")
    expect(byCode["DEU"]).toBe("Germany")
    expect(byCode["ESP"]).toBe("Spain")
    expect(byCode["USA"]).toBe("United States")
  })
})
