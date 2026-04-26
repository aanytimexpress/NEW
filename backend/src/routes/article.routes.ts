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
import {
  requireAdminPermission,
  requireArticleUpdateAccess,
  requireNewsroomAccess,
  requireNewsroomPermission,
  requirePermission
} from "../middlewares/auth.middleware.js";
import { cacheResponse } from "../middlewares/cache.middleware.js";

const router = Router();

router.get("/", cacheResponse(60), listArticlesController);
router.get("/:slug", cacheResponse(120), getArticleController);

router.post("/", ...requireNewsroomPermission("articles:create"), createArticleController);
router.patch(
  "/:id",
  ...requireNewsroomAccess(),
  requirePermission("articles:create"),
  requireArticleUpdateAccess,
  updateArticleController
);
router.post(
  "/:id/status",
  ...requireNewsroomPermission("articles:review"),
  changeArticleStatusController
);
router.post(
  "/:id/schedule",
  ...requireAdminPermission("articles:publish"),
  scheduleArticleController
);
router.patch(
  "/:id/flags",
  ...requireAdminPermission("articles:publish"),
  updateArticleFlagsController
);
router.get(
  "/:id/seo-insights",
  ...requireNewsroomPermission("articles:update:any"),
  seoInsightsController
);
router.get(
  "/:id/revisions",
  ...requireNewsroomPermission("articles:update:any"),
  listArticleRevisionsController
);
router.post(
  "/:id/revisions/rollback",
  ...requireNewsroomPermission("articles:update:any"),
  rollbackArticleRevisionController
);

export default router;
