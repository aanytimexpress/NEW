import { Router } from "express";
import {
  createCommentController,
  listCommentController,
  moderateCommentController
} from "../controllers/comment.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listCommentController);
router.post("/", createCommentController);
router.patch(
  "/:id/moderate",
  requireAuth,
  requirePermission("comments:moderate"),
  moderateCommentController
);

export default router;
