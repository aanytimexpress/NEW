import { Router } from "express";
import {
  backupController,
  listActivityLogsController,
  restoreController
} from "../controllers/system.controller.js";
import { requireAdminPermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/logs", ...requireAdminPermission("logs:view"), listActivityLogsController);
router.get("/backup", ...requireAdminPermission("backup:manage"), backupController);
router.post("/restore", ...requireAdminPermission("backup:manage"), restoreController);

export default router;
