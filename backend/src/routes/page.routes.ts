import { Router } from "express";
import {
  getPageBySlugController,
  listPagesController,
  upsertPageController
} from "../controllers/page.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listPagesController);
router.get("/:slug", getPageBySlugController);
router.put("/", requireAuth, requirePermission("settings:manage"), upsertPageController);

export default router;
