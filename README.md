# Climate Hub Core

A backend project for ingesting, processing, and exposing climate and economic data sourced from public datasets.

Built with Node.js, TypeScript, Express, Prisma, and PostgreSQL.

---

## Overview

The system collects public climate and economic indicators (CO₂ emissions, GDP, population) for five countries (ITA, FRA, DEU, ESP, USA), processes them through ETL pipelines, persists them in PostgreSQL, and exposes them through a REST API.

```
World Bank API
  → Ingestion Pipeline   (fetch raw JSON per country/indicator)
  → Processing Pipeline  (merge, normalise, persist)
  → PostgreSQL           (via Prisma)
  → REST API             (Express + TypeScript)
```

---

## Current Features

- **Data ingestion** — fetches GDP, population, and CO₂ data from the World Bank API per country
- **Processing pipeline** — merges raw datasets, fills nulls, upserts into PostgreSQL
- **REST API** — query endpoints for climate and economic data per country
- **Trend analysis** — percentage growth between the earliest and latest valid records
- **Metrics calculation** — pre-computed per-country growth metrics with hash-based idempotency
- **Insights endpoint** — backed by a separate FastAPI service
- **Swagger UI** — auto-generated OpenAPI documentation
- **Health endpoint** — reports database connectivity status
- **Docker support** — full `docker compose` setup including Postgres, the API, and the AI processor
- **Test suite** — unit, integration, and DTO layers

---

## Architecture

### Stack

- **Runtime**: Node.js 20 (Debian Bookworm)
- **Language**: TypeScript (strict mode, `exactOptionalPropertyTypes`)
- **Framework**: Express 5
- **ORM**: Prisma 5
- **Database**: PostgreSQL 15
- **AI processor**: FastAPI (Python 3.11, separate container)
- **Documentation**: swagger-jsdoc + swagger-ui-express

### Layer responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| API | `src/modules/climate/api/` | Routes, controllers, DTOs, validation |
| Application | `src/modules/climate/application/` | Business logic, use cases |
| Infrastructure | `src/modules/infrastructure/` | Prisma repositories, World Bank client, AI client |
| Shared | `src/modules/shared/` | Error classes, middleware, logger, utilities |
| Pipelines | `src/modules/climate/pipelines/`, `src/modules/worldbank/` | ETL steps |
| Jobs | `src/jobs/` | CLI entry-points for ingestion and metrics |

---

## Project Structure

```
src/
├── app/                        # Express wiring (CORS, routes, health check)
├── config/                     # Countries list, World Bank indicators
├── docs/                       # Swagger spec generation
├── index.ts                    # Process entry-point
├── jobs/                       # CLI runners for ingestion and metrics update
├── modules/
│   ├── climate/
│   │   ├── api/                # Controllers, routes, DTOs, validators
│   │   ├── application/        # Service layer and use cases
│   │   └── pipelines/          # Data processing pipeline
│   ├── infrastructure/
│   │   ├── ai/                 # AI insights client
│   │   ├── database/           # Prisma repositories
│   │   └── worldbank/          # World Bank API client
│   ├── shared/                 # AppError, asyncHandler, errorHandler, logger
│   └── worldbank/              # Ingestion pipeline
├── types/                      # Shared domain types
prisma/
├── schema.prisma
└── migrations/
scripts/
└── start.sh                    # Container startup (wait → migrate → start)
```

---

## Running Locally

### Prerequisites

- Node.js 20+
- PostgreSQL 15 (or Docker)
- A `.env` file — copy from `.env.example` and fill in `DATABASE_URL`

### Install and build

```bash
npm install
npm run build
```

### Start (development, ts-node)

```bash
npm start
```

### Start (production, compiled dist)

```bash
npm run start:prod
```

### Run with Docker

Starts PostgreSQL, the AI processor, runs migrations, and launches the API:

```bash
docker compose up --build
```

> The API is available at `http://localhost:3001`.  
> Data is **not** pre-loaded by Docker. Run the ingestion and processing pipelines separately after the stack is up (see below).

---

## Data Ingestion (manual, one-time)

Ingestion must be run after the database is available.

**1. Fetch raw data from World Bank API:**

```bash
npm run ingest
```

Fetches GDP, population, and CO₂ data for all configured countries and saves them as JSON files under `data/raw/`.

**2. Process and persist to PostgreSQL:**

```bash
npm run process:data
```

Merges the raw JSON files and upserts records into the `ClimateData` table.

**3. (Optional) Recalculate metrics:**

```bash
npm run metrics
```

Computes growth percentages and updates the `ClimateMetrics` table. Safe to run repeatedly (hash-based skip if data hasn't changed).

---

## API Endpoints

Base URL: `http://localhost:3000` (local) · `http://localhost:3001` (Docker)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Database connectivity status |
| `GET` | `/api/countries/:country/climate-data` | All records for a country |
| `GET` | `/api/countries/:country/climate-data/latest` | Most recent record with at least one metric |
| `GET` | `/api/countries/:country/climate-data/trend` | Growth percentages (GDP, population, CO₂) |
| `GET` | `/api/countries/:country/climate-data/year/:year` | Record for a specific year |
| `GET` | `/api/countries/:country/insights` | Narrative summary from the insights service |

Supported country codes: `ITA`, `FRA`, `DEU`, `ESP`, `USA` (case-insensitive).

### Example

```bash
curl http://localhost:3001/api/countries/ITA/climate-data/trend
```

---

## API Documentation

Swagger UI is served at:

```
http://localhost:3000/api-docs    (local)
http://localhost:3001/api-docs    (Docker)
```

---

## Testing

```bash
npm test
```

---

## Environment Variables

See `.env.example` for the full reference. Key variables:

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | — | PostgreSQL connection string (required) |
| `PORT` | `3000` | API listen port |
| `NODE_ENV` | `development` | Controls log format |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated allowed origins |
| `AI_SERVICE_URL` | `http://localhost:8000` | AI processor base URL |
| `SWAGGER_SERVER_URL` | `http://localhost:3000/api` | Server URL shown in Swagger UI |

---

## Design Decisions

- **Two-step pipeline** (ingest → process) decouples World Bank API availability from database writes. Raw files can be corrected before processing.
- **Hash-based metrics idempotency** — metrics updates skip countries whose dataset hasn't changed, making the job safe to run on a schedule.
- **Static country list** — only configured country codes are accepted by the API. Unrecognised codes return `400` before any DB access.
- **No caching** — the dataset is small and largely read-only; every request hits Postgres directly.

---

## Roadmap

- React dashboard for data visualisation
- Additional World Bank indicators
- Extended country coverage
- Scheduled ingestion (cron / job queue)

---

## License

ISC
