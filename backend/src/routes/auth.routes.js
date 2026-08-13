import { Router } from "express";
import { changePasswordAuth, forgotPasswordAuth, loginAuth, logoutAuth, registerAuth, meAuth } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerAuth);
router.post("/login", loginAuth);
router.post("/logout", logoutAuth);
router.post("/forgot-password", forgotPasswordAuth);
router.post("/change-password", changePasswordAuth);
router.get("/me", authenticate, meAuth);

export default router;