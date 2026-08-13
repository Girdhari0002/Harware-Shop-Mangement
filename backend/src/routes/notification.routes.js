import { Router } from "express";
import { createNotification, deleteNotification, getNotificationById, listNotification, markAllRead, markRead, unreadCount, updateNotification } from "../controllers/notification.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticate);

router.get("/", listNotification);
router.get("/unread-count", unreadCount);
router.patch("/mark-all-read", markAllRead);
router.get("/:id", getNotificationById);
router.post("/", createNotification);
router.put("/:id", updateNotification);
router.patch("/:id/read", markRead);
router.delete("/:id", deleteNotification);

export default router;
