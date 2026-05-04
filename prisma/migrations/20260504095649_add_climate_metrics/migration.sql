-- CreateTable
CREATE TABLE "climate_metrics" (
    "country" TEXT NOT NULL,
    "co2_change_pct" DOUBLE PRECISION,
    "gdp_growth_pct" DOUBLE PRECISION,
    "population_growth_pct" DOUBLE PRECISION,
    "dataset_hash" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "climate_metrics_pkey" PRIMARY KEY ("country")
);
