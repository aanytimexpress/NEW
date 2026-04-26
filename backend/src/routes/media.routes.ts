import { Router } from "express";
import { listMediaController, uploadMediaController } from "../controllers/media.controller.js";
import {
  requireNewsroomAccess,
  requireNewsroomPermission
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", ...requireNewsroomAccess(), listMediaController);
router.post(
  "/upload",
  ...requireNewsroomPermission("media:manage"),
  upload.single("file"),
  uploadMediaController
);

export default router;
