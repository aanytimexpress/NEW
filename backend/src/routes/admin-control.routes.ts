import { Router } from "express";
import {
  getAdminControlsController,
  manageBreakingNewsController,
  manageTrendingNewsController,
  updateAdminControlController
} from "../controllers/admin-control.controller.js";
import {
  requireAdminPermission,
  requireNewsroomPermission
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", ...requireAdminPermission("settings:manage"), getAdminControlsController);
router.put("/", ...requireAdminPermission("settings:manage"), updateAdminControlController);
router.put(
  "/breaking-news",
  ...requireNewsroomPermission("homepage:manage"),
  manageBreakingNewsController
);
router.put(
  "/trending-news",
  ...requireNewsroomPermission("homepage:manage"),
  manageTrendingNewsController
);

export default router;
