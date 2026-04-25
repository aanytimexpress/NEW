import { Router } from "express";
import {
  createAdController,
  listAdsController,
  updateAdController
} from "../controllers/ad.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listAdsController);
router.post("/", requireAuth, requirePermission("ads:manage"), createAdController);
router.patch("/:id", requireAuth, requirePermission("ads:manage"), updateAdController);

export default router;
