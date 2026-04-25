import { Router } from "express";
import {
  listHomepageSectionsController,
  upsertHomepageSectionController
} from "../controllers/homepage-section.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";
import { cacheResponse } from "../middlewares/cache.middleware.js";

const router = Router();

router.get("/", cacheResponse(60), listHomepageSectionsController);
router.put(
  "/",
  requireAuth,
  requirePermission("homepage:manage"),
  upsertHomepageSectionController
);

export default router;
