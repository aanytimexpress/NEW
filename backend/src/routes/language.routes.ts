import { Router } from "express";
import {
  listLanguagesController,
  upsertLanguageController
} from "../controllers/language.controller.js";
import { requireAdminPermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listLanguagesController);
router.put("/", ...requireAdminPermission("settings:manage"), upsertLanguageController);

export default router;
