const express = require("express")
const climateRoutes = require("../api/routes/climateDataRoutes")

const app = express()

app.use(express.json())

app.use("/api", climateRoutes)

module.exports = app