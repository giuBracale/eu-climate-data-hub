const express = require("express")
const climateRoutes = require("../api/routes/climateDataRoutes")

const app = express()
const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("../docs/swagger")

const errorHandler = require("../api/middleware/errorHandler")

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(express.json())

app.use("/api", climateRoutes)

app.get("/", (req, res) => {
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

module.exports = app