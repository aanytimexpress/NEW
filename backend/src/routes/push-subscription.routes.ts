import { Router } from "express";
import {
  listPushSubscriptionsController,
  registerPushSubscriptionController,
  unregisterPushSubscriptionController
} from "../controllers/push-subscription.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", registerPushSubscriptionController);
router.post("/unsubscribe", unregisterPushSubscriptionController);
router.get(
  "/",
  requireAuth,
  requirePermission("notifications:manage"),
  listPushSubscriptionsController
);

export default router;
