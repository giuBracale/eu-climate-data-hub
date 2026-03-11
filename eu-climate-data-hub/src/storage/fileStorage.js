const fs = require("fs")
const path = require("path")

const RAW_DIR = path.join(__dirname, "../../data/raw")

function saveRawData(filename, data) {

  const filePath = path.join(RAW_DIR, filename)

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

}

module.exports = {
  saveRawData
}