const swaggerJsdoc = require("swagger-jsdoc")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Climate Data API",
      version: "1.0.0",
      description: "API for climate and economic indicators"
    },
    servers: [
      {
        url: "http://localhost:3000/api"
      }
    ]
  },
  apis: ["./src/api/routes/*.js"]
}

module.exports = swaggerJsdoc(options)