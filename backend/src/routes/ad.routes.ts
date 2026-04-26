import { Router } from "express";
import {
  createAdController,
  listAdsController,
  updateAdController
} from "../controllers/ad.controller.js";
import { requireAdminPermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listAdsController);
router.post("/", ...requireAdminPermission("ads:manage"), createAdController);
router.patch("/:id", ...requireAdminPermission("ads:manage"), updateAdController);

export default router;
