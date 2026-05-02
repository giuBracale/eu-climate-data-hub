export const indicators = {
  gdp: "NY.GDP.MKTP.CD",
  population: "SP.POP.TOTL",
  co2: "EN.GHG.CO2.MT.CE.AR5"
} as const

export type IndicatorKey = keyof typeof indicators