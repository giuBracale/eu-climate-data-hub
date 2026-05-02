import swaggerJsdoc from "swagger-jsdoc"

const options: swaggerJsdoc.Options = {
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
  apis: ["./src/api/routes/*.ts"]
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec