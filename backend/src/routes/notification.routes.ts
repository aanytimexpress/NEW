import { Router } from "express";
import {
  createNotificationController,
  listNotificationController
} from "../controllers/notification.controller.js";
import { requireAdminPermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", ...requireAdminPermission("notifications:manage"), listNotificationController);
router.post("/", ...requireAdminPermission("notifications:manage"), createNotificationController);

export default router;
