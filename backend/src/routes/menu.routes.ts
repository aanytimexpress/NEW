import { Router } from "express";
import { listMenuController, upsertMenuController } from "../controllers/menu.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listMenuController);
router.put("/", requireAuth, requirePermission("settings:manage"), upsertMenuController);

export default router;
