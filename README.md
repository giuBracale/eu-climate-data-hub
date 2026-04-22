# EU Climate Data Hub
## Overview

This project simulates a production-like backend system for data integration and processing.

A backend system that integrates, processes, and exposes European CO₂ and economic data through a structured API.

The project simulates a real-world data platform, combining multiple public datasets (World Bank) into a unified, analytics-ready system with end-to-end data pipelines.

---

## Key Features

- Data ingestion from external APIs (World Bank)
- ETL pipeline for data processing and normalization
- Clean separation between domain logic and infrastructure
- REST API to access processed climate data
- Automated tests for API and domain logic

---

## Architecture

The system is designed with a production-inspired architecture:

### Architecture flow

```plaintext
[World Bank API]
↓
Ingestion Pipeline
↓
Raw Data Storage
↓
Processing Pipeline
↓
Processed Dataset
↓
Repository Layer
↓
Domain Services
↓
REST API
```

### Layers

- **API Layer** → controllers and routes
- **Domain Layer** → pure business logic
- **Infrastructure Layer** → external APIs and storage
- **Pipelines** → data ingestion and processing

---

## Data Sources

Data is retrieved from the World Bank API:

- GDP
- Population
- CO₂ emissions

---

## Pipelines

### 1. Ingestion

Fetches raw data from the World Bank API and stores it locally.

``` bash
node src/pipelines/worldbankIngestion.pipeline.js ITA
```

### 2. Processing

Merges and transforms raw datasets into a unified format.

``` bash
node src/pipelines/climateDataProcessingPipeline.js
```
---

## API Endpoints

Start the server:

node src/index.js
Available endpoints:
GET /api/countries/:country/climate-data
GET /api/countries/:country/climate-data/latest
GET /api/countries/:country/climate-data/trend

### Example:

GET /api/countries/ITA/climate-data/trend

### Example request

curl http://localhost:3000/api/countries/ITA/climate-data/trend

---

## Testing

Run all tests:

npm test

The project includes:

API tests (integration)
Domain tests (unit)

---

## Project Structure

```plaintext
src/
├── api/                # HTTP layer
├── domain/             # business logic
├── infrastructure/     # external systems (API, storage)
├── pipelines/          # ETL processes
├── config/
├── utils/
└── index.js
```

---

## Design Decisions
- Separation of concerns between domain logic and infrastructure
- Pipelines designed as independent, executable units
- Domain layer operates on pure data (no IO dependencies)
- Data is stored locally for simplicity, but the architecture supports external storage

---

## Notes
Raw and processed data are generated locally via pipelines
Some recent data points may contain null values due to missing data from the source APIs

---

## Why this project

This project was built to simulate how real-world backend systems handle data integration:

ingesting external datasets
transforming and normalizing data
exposing it through a clean API

---

## Future Improvements
Add database integration (PostgreSQL)
Introduce caching layer
Deploy as a cloud service
Add data visualization layer

---


## Quick Start

Install dependencies:

```bash
npm install
```
Run ingestion:
```bash
node src/pipelines/worldbankIngestion.pipeline.js ITA
```
Run processing:
```bash
node src/pipelines/climateDataProcessingPipeline.js
```
Start server:
```bash
node src/index.js
```