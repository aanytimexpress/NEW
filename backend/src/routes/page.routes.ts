import { Router } from "express";
import {
  getPageBySlugController,
  listPagesController,
  upsertPageController
} from "../controllers/page.controller.js";
import { requireAdminPermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listPagesController);
router.get("/:slug", getPageBySlugController);
router.put("/", ...requireAdminPermission("settings:manage"), upsertPageController);

export default router;
