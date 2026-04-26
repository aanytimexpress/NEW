import { Router } from "express";
import {
  listSettingsController,
  upsertSettingController
} from "../controllers/setting.controller.js";
import { requireAdminPermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listSettingsController);
router.put("/", ...requireAdminPermission("settings:manage"), upsertSettingController);

export default router;
