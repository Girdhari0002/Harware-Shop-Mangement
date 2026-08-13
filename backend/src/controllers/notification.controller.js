import { asyncHandler } from "../utils/asyncHandler.js";
import { notificationService } from "../services/notification.service.js";

export const listNotification = asyncHandler(async (req, res) => {
  const r = await notificationService.list(req.query);
  res.json({ success: true, data: r.data, total: r.total, page: r.page, limit: r.limit });
});

export const getNotificationById = asyncHandler(async (req, res) => {
  const found = await notificationService.getById(req.params.id);
  if (!found) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: found.data });
});

export const createNotification = asyncHandler(async (req, res) => {
  const { data } = await notificationService.create(req.body);
  res.status(201).json({ success: true, data });
});

export const updateNotification = asyncHandler(async (req, res) => {
  const found = await notificationService.update(req.params.id, req.body);
  if (!found) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: found.data });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const removed = await notificationService.remove(req.params.id);
  if (!removed) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, message: "Deleted" });
});

export const unreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.unreadCount();
  res.json({ success: true, data: { count } });
});

export const markRead = asyncHandler(async (req, res) => {
  const updated = await notificationService.markRead(req.params.id);
  if (!updated) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: updated });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await notificationService.markAllRead();
  res.json({ success: true, message: "All notifications marked as read" });
});
