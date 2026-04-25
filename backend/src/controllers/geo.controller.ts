import type { Request, Response } from "express";
import { DistrictModel } from "../models/district.model.js";
import { UpazilaModel } from "../models/upazila.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const listDistrictsController = asyncHandler(async (_req: Request, res: Response) => {
  const districts = await DistrictModel.find().sort({ "translations.en.name": 1 }).lean();
  res.json({ success: true, data: districts });
});

export const listUpazilasController = asyncHandler(async (req: Request, res: Response) => {
  const filters: Record<string, unknown> = {};
  if (req.query.district) filters.district = req.query.district;
  const upazilas = await UpazilaModel.find(filters).sort({ "translations.en.name": 1 }).lean();
  res.json({ success: true, data: upazilas });
});

export const districtMapTreeController = asyncHandler(async (_req: Request, res: Response) => {
  const districts = await DistrictModel.find().lean();
  const upazilas = await UpazilaModel.find().lean();

  const tree = districts.map((district) => ({
    ...district,
    upazilas: upazilas.filter((upazila) => upazila.district.toString() === district._id.toString())
  }));

  res.json({ success: true, data: tree });
});
