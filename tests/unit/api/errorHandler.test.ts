import request from "supertest"
import express from "express"

import errorHandler from "@middleware/errorHandler"
import AppError from "@errors/AppError"

const app = express()

app.get("/error", (_req, _res, next) => {
  next(new AppError("Test error", 400))
})

app.get("/crash", (_req, _res, next) => {
  next(new Error("Unexpected"))
})

app.use(errorHandler)

describe("Error Handler", () => {
  it("should handle AppError correctly", async () => {
    const res = await request(app).get("/error")

    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe("Test error")
  })

  it("should handle unexpected errors", async () => {
    const res = await request(app).get("/crash")

    expect(res.statusCode).toBe(500)
    expect(res.body.error).toBe("Internal Server Error")
  })

  it("should always return JSON error structure", async () => {
    const res = await request(app).get("/crash")

    expect(res.body).toHaveProperty("error")
  })
})