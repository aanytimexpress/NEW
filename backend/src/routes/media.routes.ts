import { Router } from "express";
import { listMediaController, uploadMediaController } from "../controllers/media.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", requireAuth, listMediaController);
router.post(
  "/upload",
  requireAuth,
  requirePermission("media:manage"),
  upload.single("file"),
  uploadMediaController
);

export default router;
