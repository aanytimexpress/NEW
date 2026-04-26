import { Router } from "express";
import { listMenuController, upsertMenuController } from "../controllers/menu.controller.js";
import { requireAdminPermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listMenuController);
router.put("/", ...requireAdminPermission("settings:manage"), upsertMenuController);

export default router;
