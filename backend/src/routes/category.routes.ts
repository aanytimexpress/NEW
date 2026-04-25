import { Router } from "express";
import {
  createCategoryController,
  listCategoryController,
  updateCategoryController
} from "../controllers/category.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";
import { cacheResponse } from "../middlewares/cache.middleware.js";

const router = Router();

router.get("/", cacheResponse(300), listCategoryController);
router.post("/", requireAuth, requirePermission("categories:manage"), createCategoryController);
router.patch(
  "/:id",
  requireAuth,
  requirePermission("categories:manage"),
  updateCategoryController
);

export default router;
