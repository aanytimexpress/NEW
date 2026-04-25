import { Router } from "express";
import {
  backupController,
  listActivityLogsController,
  restoreController
} from "../controllers/system.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);
router.get("/logs", requirePermission("logs:view"), listActivityLogsController);
router.get("/backup", requirePermission("backup:manage"), backupController);
router.post("/restore", requirePermission("backup:manage"), restoreController);

export default router;
