import { Router } from "express";
import { listAttendance, scanAttendance, todayAttendance } from "../controllers/attendance.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// Public — scanned/entered from the landing-page kiosk, not an authenticated admin session.
router.post("/scan", scanAttendance);

router.use(authenticate);
router.use(authorizeRoles("admin"));
router.get("/", listAttendance);
router.get("/today", todayAttendance);

export default router;
