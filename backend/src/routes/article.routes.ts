import { Router } from "express";
import {
  changeArticleStatusController,
  createArticleController,
  getArticleController,
  listArticleRevisionsController,
  listArticlesController,
  rollbackArticleRevisionController,
  scheduleArticleController,
  seoInsightsController,
  updateArticleController,
  updateArticleFlagsController
} from "../controllers/article.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";
import { cacheResponse } from "../middlewares/cache.middleware.js";

const router = Router();

router.get("/", cacheResponse(60), listArticlesController);
router.get("/:slug", cacheResponse(120), getArticleController);

router.post("/", requireAuth, requirePermission("articles:create"), createArticleController);
router.patch("/:id", requireAuth, requirePermission("articles:create"), updateArticleController);
router.post(
  "/:id/status",
  requireAuth,
  requirePermission("articles:review"),
  changeArticleStatusController
);
router.post(
  "/:id/schedule",
  requireAuth,
  requirePermission("articles:publish"),
  scheduleArticleController
);
router.patch(
  "/:id/flags",
  requireAuth,
  requirePermission("articles:publish"),
  updateArticleFlagsController
);
router.get(
  "/:id/seo-insights",
  requireAuth,
  requirePermission("articles:update:any"),
  seoInsightsController
);
router.get(
  "/:id/revisions",
  requireAuth,
  requirePermission("articles:update:any"),
  listArticleRevisionsController
);
router.post(
  "/:id/revisions/rollback",
  requireAuth,
  requirePermission("articles:update:any"),
  rollbackArticleRevisionController
);

export default router;
