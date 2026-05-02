import express, { Request, Response } from "express"
import climateRoutes from "../api/routes/climateDataRoutes"

import swaggerUi from "swagger-ui-express"
import swaggerSpec from "../docs/swagger"

import errorHandler from "../api/middleware/errorHandler"

const app = express()

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(express.json())

app.use("/api", climateRoutes)

app.get("/", (req: Request, res: Response) => {
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