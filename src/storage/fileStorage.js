const fs = require("fs")
const path = require("path")

const RAW_DIR = path.join(__dirname, "../../data/raw")

function saveRawData(country, filename, data) {

  const countryDir = path.join(RAW_DIR, country)

  fs.mkdirSync(countryDir, { recursive: true })

  const filePath = path.join(countryDir, filename)

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

}

module.exports = {
  saveRawData
}