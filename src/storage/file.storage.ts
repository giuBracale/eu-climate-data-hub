import fs from "fs"
import path from "path"

const RAW_DIR = path.join(__dirname, "../../data/raw")

export function saveRawData(
  country: string,
  filename: string,
  data: unknown
): void {
  const countryDir = path.join(RAW_DIR, country)

  fs.mkdirSync(countryDir, { recursive: true })

  const filePath = path.join(countryDir, filename)

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}
