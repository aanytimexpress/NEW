import { Router } from "express";
import {
  districtMapTreeController,
  listDistrictsController,
  listUpazilasController
} from "../controllers/geo.controller.js";

const router = Router();

router.get("/districts", listDistrictsController);
router.get("/upazilas", listUpazilasController);
router.get("/district-map", districtMapTreeController);

export default router;
