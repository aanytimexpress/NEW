import { Router } from "express";
import {
  createCommentController,
  listCommentController,
  moderateCommentController
} from "../controllers/comment.controller.js";
import { requireNewsroomPermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listCommentController);
router.post("/", createCommentController);
router.patch("/:id/moderate", ...requireNewsroomPermission("comments:moderate"), moderateCommentController);

export default router;
