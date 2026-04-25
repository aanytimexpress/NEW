import { Router } from "express";
import {
  listLanguagesController,
  upsertLanguageController
} from "../controllers/language.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listLanguagesController);
router.put("/", requireAuth, requirePermission("settings:manage"), upsertLanguageController);

export default router;
