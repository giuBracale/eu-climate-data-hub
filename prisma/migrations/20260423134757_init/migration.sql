-- CreateTable
CREATE TABLE "ClimateData" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "gdp" DOUBLE PRECISION,
    "population" DOUBLE PRECISION,
    "co2" DOUBLE PRECISION,

    CONSTRAINT "ClimateData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClimateData_country_year_key" ON "ClimateData"("country", "year");
