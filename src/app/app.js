const express = require("express")
const climateRoutes = require("../api/routes/climateDataRoutes")

const app = express()
const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("../docs/swagger")

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(express.json())

app.use("/api", climateRoutes)

module.exports = app