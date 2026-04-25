import { Router } from "express";
import {
  getAdminControlsController,
  manageBreakingNewsController,
  manageTrendingNewsController,
  updateAdminControlController
} from "../controllers/admin-control.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", requirePermission("settings:manage"), getAdminControlsController);
router.put("/", requirePermission("settings:manage"), updateAdminControlController);
router.put(
  "/breaking-news",
  requirePermission("homepage:manage"),
  manageBreakingNewsController
);
router.put(
  "/trending-news",
  requirePermission("homepage:manage"),
  manageTrendingNewsController
);

export default router;
