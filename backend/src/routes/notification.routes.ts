import { Router } from "express";
import {
  createNotificationController,
  listNotificationController
} from "../controllers/notification.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", requirePermission("notifications:manage"), listNotificationController);
router.post("/", requirePermission("notifications:manage"), createNotificationController);

export default router;
