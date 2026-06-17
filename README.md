# Climate Hub

REST API and web frontend for exploring GDP, population, and CO₂ emission trends sourced from the World Bank Open Data API. The backend ingests and stores the data in PostgreSQL and exposes it through a REST API. The frontend visualises it with interactive time-series charts.

Two separate repositories make up the project. This one (**ClimateHubAPI**) is the backend.

**Live:** [climate-hub-web.vercel.app](https://climate-hub-web.vercel.app) · [API on Render](https://eu-climate-data-hub.onrender.com)

---

## Project Structure

### ClimateHubAPI (this repository)

Node.js REST API built with TypeScript, Express 5, and Prisma.

- **Ingestion pipeline** — fetches raw data from the World Bank API per country and indicator, writes it to JSON files under `data/raw/`
- **Processing pipeline** — merges raw files by year, upserts records into the `ClimateData` table
- **Metrics job** — computes GDP, population, and CO₂ growth percentages per country, writes to `ClimateMetrics`
- **REST API** — endpoints for country data, trends, and historical records; Swagger UI at `/api-docs`

### ClimateHubWeb

React frontend built with Vite, TanStack Query, Recharts, and Tailwind CSS v4.

- Country browser with summary cards
- Per-country detail view: time-series charts for GDP, population, and CO₂
- Year-by-year data selector
- UI localisation: English and Italian (i18next)

---

## Architecture

```
User
 ↓
Vercel (React/Vite frontend)
 ↓
Render (Node.js/Express API)
 ↓
Neon (PostgreSQL)
```

**Vercel** serves the compiled frontend. `VITE_API_URL` is set at build time to point at the Render service URL.

**Render** runs the compiled Node.js API as a Web Service. TypeScript is compiled to `dist/` at build time; the runtime executes `dist/src/index.js`. Migrations are applied with `prisma migrate deploy` before each deploy.

**Neon** is the managed PostgreSQL host. Two tables: `ClimateData` (one row per country/year) and `ClimateMetrics` (one row per country with pre-computed growth figures).

---

## Data Sources

All data is from the [World Bank Open Data API](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-using-the-api).

| Indicator | World Bank code | Unit |
|-----------|-----------------|------|
| GDP | `NY.GDP.MKTP.CD` | Current USD |
| Population | `SP.POP.TOTL` | Total persons |
| CO₂ emissions | `EN.GHG.CO2.MT.CE.AR5` | Mt CO₂ equivalent (AR5 methodology) |

Historical coverage depends on World Bank data availability. Some years have `null` for one or more indicators, particularly CO₂.

Countries currently configured: **ITA, FRA, DEU, ESP, USA**

---

## API

Full reference: [docs/api.md](docs/api.md) · Interactive: `/api-docs` (Swagger UI)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Database connectivity check |
| `GET` | `/api/countries` | List supported countries |
| `GET` | `/api/countries/:country/climate-data` | All records for a country |
| `GET` | `/api/countries/:country/climate-data/latest` | Most recent record with at least one non-null value |
| `GET` | `/api/countries/:country/climate-data/trend` | Growth percentages between first and last valid records |
| `GET` | `/api/countries/:country/climate-data/year/:year` | Record for a specific year |
| `GET` | `/api/countries/:country/insights` | Optional country summary (requires separate AI service, not active in production) |

Country codes are case-insensitive. Unrecognised codes return `400 Invalid country code`.

---

## Local Development

### Backend

```bash
cp .env.example .env
# Fill in DATABASE_URL with your PostgreSQL connection string
npm install
npm start
```

The API starts on `http://localhost:3000` by default.

### Frontend

```bash
# In the ClimateHubWeb directory
cp .env.example .env
# Set VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

### Database

Apply pending migrations against a local PostgreSQL instance:

```bash
npx prisma migrate dev
```

---

## Environment Variables

### Backend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `PORT` | No | `3000` | Port the API listens on |
| `NODE_ENV` | No | `development` | `production` enables JSON log format (pino) |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Comma-separated list of allowed origins |
| `AI_SERVICE_URL` | No | `http://localhost:8000` | Base URL of the AI insights processor |
| `SWAGGER_SERVER_URL` | No | `http://localhost:3000/api` | Server URL shown in Swagger UI |

Copy `.env.example` to `.env` and fill in secrets before running locally.

### Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Base URL of the backend API (e.g. `http://localhost:3000`) |

---

## Data Ingestion

Ingestion is manual. There is no scheduled job. Run the three steps in order after the database is available.

```bash
# Step 1 — fetch from World Bank API → data/raw/{country}/{indicator}.json
npm run ingest

# Step 2 — merge raw files by year, upsert into ClimateData table
npm run process:climate

# Step 3 — compute growth metrics, write to ClimateMetrics table
npm run metrics
```

Steps 1 and 2 are decoupled: you can inspect or correct the raw JSON files before loading them into the database. Step 3 is idempotent — countries whose dataset hasn't changed since the last run are skipped (SHA-256 hash comparison).

---

## Deployment

### Backend — Render

**Build command:**
```
npm ci && npx prisma generate && npm run build
```

`prisma generate` must run at build time so Prisma can bundle the correct query engine binary for the deployment environment.

**Start command:**
```
npm run start:prod
```

Migrations run automatically via `prisma migrate deploy` during deployment. Run this manually only when provisioning a new database:
```bash
DATABASE_URL=<neon-url> npx prisma migrate deploy
```

### Frontend — Vercel

Framework preset: **Vite**. Set `VITE_API_URL` in Vercel's environment settings to the Render service URL.

### Database — Neon

PostgreSQL 15. Neon connection strings include `?sslmode=require` — keep it in `DATABASE_URL`.

---

## Testing

```bash
npm test
```

The current test suite covers unit and API-level behaviour: controllers, validators, DTOs, service functions, and the metrics use case.

---

## Limitations

- **Countries are hardcoded.** Only ITA, FRA, DEU, ESP, USA are supported. Adding a country requires changing `src/config/countries.ts` and re-running ingestion and processing.
- **No scheduled ingestion.** Data must be refreshed manually by re-running the three pipeline steps.
- **Historical gaps.** Some years have `null` values for one or more indicators depending on World Bank data availability.
- **AI insights not deployed.** `/api/countries/:country/insights` requires a separately running FastAPI service. It is not part of the current production setup; the endpoint returns `503` when the AI service is unreachable.
- **No authentication.** All API endpoints are publicly accessible.
- **No caching.** Every request hits Postgres directly. Acceptable for a small, read-mostly dataset, but worth noting.

---

## License

ISC
