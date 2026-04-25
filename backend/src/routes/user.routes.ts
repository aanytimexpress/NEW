import { Router } from "express";
import {
  createUserController,
  listUsersController,
  updateUserController
} from "../controllers/user.controller.js";
import { requireAuth, requirePermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", requirePermission("users:manage"), listUsersController);
router.post("/", requirePermission("users:manage"), createUserController);
router.patch("/:id", requirePermission("users:manage"), updateUserController);

export default router;
