from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class ClimateRecord(BaseModel):
    year: str
    gdp: float | None = None
    population: float | None = None
    co2: float | None = None

class ClimateRequest(BaseModel):
    country: str
    data: List[ClimateRecord]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze")
def analyze(request: ClimateRequest):
    if not request.data:
        return {"insight": "No data"}

    return {
        "country": request.country,
        "insight": f"Received {len(request.data)} records"
    }