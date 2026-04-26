import { Router } from "express";
import {
  listHomepageSectionsController,
  upsertHomepageSectionController
} from "../controllers/homepage-section.controller.js";
import { requireNewsroomPermission } from "../middlewares/auth.middleware.js";
import { cacheResponse } from "../middlewares/cache.middleware.js";

const router = Router();

router.get("/", cacheResponse(60), listHomepageSectionsController);
router.put("/", ...requireNewsroomPermission("homepage:manage"), upsertHomepageSectionController);

export default router;
