const AppError = require("../../domain/errors/AppError")

function validateCountry(country) {
  if (!country || country.length !== 3) {
    throw new AppError("Invalid country code", 400)
  }
}

function validateYear(year) {
  if (year && isNaN(Number(year))) {
    throw new AppError("Invalid year format", 400)
  }
}

module.exports = {
  validateCountry,
  validateYear
}