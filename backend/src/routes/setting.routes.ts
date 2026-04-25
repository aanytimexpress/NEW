import { Router } from "express";
import {
  listSettingsController,
  upsertSettingController
} from "../controllers/setting.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listSettingsController);
router.put("/", requireAuth, requirePermission("settings:manage"), upsertSettingController);

export default router;
