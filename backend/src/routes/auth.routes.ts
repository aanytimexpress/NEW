import { Router } from "express";
import {
  loginController,
  meController,
  logoutController,
  refreshController,
  setupTwoFactorController,
  signupController,
  verifyTwoFactorController
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/security.middleware.js";

const router = Router();

router.post("/signup", authRateLimiter, signupController);
router.post("/login", authRateLimiter, loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);
router.get("/me", requireAuth, meController);
router.post("/2fa/setup", requireAuth, setupTwoFactorController);
router.post("/2fa/verify", requireAuth, verifyTwoFactorController);

export default router;
