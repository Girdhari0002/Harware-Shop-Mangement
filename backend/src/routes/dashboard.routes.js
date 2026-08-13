import { Router } from "express";
import { listDashboard } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(authenticate);
router.get("/", listDashboard);
export default router;