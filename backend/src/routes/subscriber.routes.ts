import { Router } from "express";
import {
  listSubscribersController,
  subscribeController
} from "../controllers/subscriber.controller.js";
import { requireAdminPermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", subscribeController);
router.get("/", ...requireAdminPermission("subscribers:manage"), listSubscribersController);

export default router;
