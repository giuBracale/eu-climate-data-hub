import express, { Request, Response } from "express"
import cors from "cors"
import climateRoutes from "../modules/climate/api/climate.routes"
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "../docs/swagger"
import errorHandler from "../modules/shared/middleware/error.handler"
import { prisma } from "../modules/infrastructure/database/prisma.client"

const app = express()

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:5173"]

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use("/api", climateRoutes)

app.get("/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: "ok", database: "connected" })
  } catch {
    res.status(503).json({ status: "degraded", database: "unreachable" })
  }
})

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "EU Climate Data API",
    endpoints: {
      all: "/api/countries/{country}/climate-data",
      latest: "/api/countries/{country}/climate-data/latest",
      trend: "/api/countries/{country}/climate-data/trend",
      byYear: "/api/countries/{country}/climate-data/{year}"
    },
    docs: "/api-docs"
  })
})

app.use(errorHandler)

export default app