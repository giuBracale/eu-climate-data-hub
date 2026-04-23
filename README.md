# EU Climate Data Hub
## Overview

This project simulates a production-like backend system for data integration and processing.

It integrates, processes, and exposes climate and economic data (CO₂, GDP, population) through a structured REST API.

The system replicates a real-world data platform by combining multiple public datasets (World Bank), transforming them through ETL pipelines, and persisting them in a PostgreSQL database using Prisma.

---

## Key Features

- Data ingestion from external APIs (World Bank)
- ETL pipeline for data processing and normalization
- PostgreSQL database integration with Prisma ORM
- Clean separation between domain logic and infrastructure
- REST API to access processed climate data
- Automated tests for API and domain logic
- Dockerized environment with automated startup pipelines

---

## Architecture

The system is designed with a production-inspired architecture:

### Architecture flow

```plaintext
[World Bank API]
↓
Ingestion Pipeline
↓
Raw Data Storage (JSON)
↓
Processing Pipeline
↓
PostgreSQL (via Prisma)
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
- **Infrastructure Layer** → database and external APIs
- **Pipelines** → data ingestion and processing

---

## Data Sources

Data is retrieved from the World Bank API:

- GDP
- Population
- CO₂ emissions

---

## Database

The system uses PostgreSQL with Prisma ORM to persist processed data.

### Schema

```plaintext
ClimateData
- country
- year
- gdp
- population
- co2
```

## Pipelines

### 1. Ingestion

Fetches raw data from the World Bank API and stores it locally.

``` bash
node src/pipelines/worldbankIngestion.pipeline.js ITA
```

### 2. Processing

Merges and transforms raw datasets and persists them into PostgreSQL.

``` bash
node src/pipelines/climateDataProcessingPipeline.js
```
---

## API Endpoints

Base URL: http://localhost:3001

| Endpoint | Description |
|--------|------------|
| GET /api/countries/{country}/climate-data | Get full dataset |
| GET /api/countries/{country}/climate-data/{year} | Get data for a specific year |
| GET /api/countries/{country}/climate-data/latest | Get latest available data |
| GET /api/countries/{country}/climate-data/trend | Get trend analysis |

### Example

```bash
curl http://localhost:3001/api/countries/ITA/climate-data/trend
```
> Note: When running locally without Docker, the API is available on port 3000.
> When running with Docker, it is exposed on port 3001.
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
├── infrastructure/     # database and external APIs
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
- PostgreSQL is used to simulate a real persistence layer

---

## Notes
Raw data is generated via ingestion pipelines  
Processed data is stored in PostgreSQL

---

## Why this project

This project was built to simulate how real-world backend systems handle data integration:

- ingesting external datasets
- transforming and normalizing data through ETL pipelines
- persisting data in a relational database
- exposing it through a structured REST API

---

## Future Improvements

- Caching layer (Redis)
- Cloud deployment
- Data visualization layer
- Multi-country ingestion and scheduling

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

## Run with Docker

```bash
docker-compose up --build
```

The system will automatically:

- start PostgreSQL
- run database migrations
- fetch data from the World Bank API
- process and store data in the database
- start the API server