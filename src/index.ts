import app from "./app/app"
import { logger } from "@/modules/shared/utils/logger"

const PORT = Number(process.env.PORT ?? 3000)

process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught exception — shutting down")
  process.exit(1)
})

process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled promise rejection — shutting down")
  process.exit(1)
})

app.listen(PORT, () => {
  logger.info({ port: PORT }, "Climate Data API running")
})