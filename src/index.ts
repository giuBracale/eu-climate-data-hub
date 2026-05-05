import app from "./app/app"
import { logger } from "@/modules/shared/utils/logger"

const PORT = 3000

app.listen(PORT, () => {
  logger.info({ port: PORT }, "Climate Data API running")
})