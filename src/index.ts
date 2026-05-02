import app from "./app/app"

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Climate Data API running on port ${PORT}`)
})