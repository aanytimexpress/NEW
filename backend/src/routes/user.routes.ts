import { Router } from "express";
import {
  createUserController,
  listUsersController,
  updateUserController
} from "../controllers/user.controller.js";
import { requireAdminPermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", ...requireAdminPermission("users:manage"), listUsersController);
router.post("/", ...requireAdminPermission("users:manage"), createUserController);
router.patch("/:id", ...requireAdminPermission("users:manage"), updateUserController);

export default router;
