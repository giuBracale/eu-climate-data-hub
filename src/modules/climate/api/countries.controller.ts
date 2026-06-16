import type { Request, Response } from "express"
import * as countriesService from "@/modules/climate/application/countries.service"

export function getCountries(_req: Request, res: Response): void {
  res.json(countriesService.getCountries())
}
