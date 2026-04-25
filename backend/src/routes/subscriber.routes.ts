import { Router } from "express";
import {
  listSubscribersController,
  subscribeController
} from "../controllers/subscriber.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", subscribeController);
router.get(
  "/",
  requireAuth,
  requirePermission("subscribers:manage"),
  listSubscribersController
);

export default router;
