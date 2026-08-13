import { asyncHandler } from "../utils/asyncHandler.js";
import { settingsService } from "../services/settings.service.js";

export const listSettings = asyncHandler(async (req, res) => {
  const users = await settingsService.listUsers();
  return res.json({ success: true, data: users });
});

export const getSettingsById = asyncHandler(async (req, res) => {
  const user = await settingsService.getUser(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, data: user });
});

export const createSettings = asyncHandler(async (req, res) => {
  const { data } = await settingsService.createUser(req.body);
  return res.status(201).json({ success: true, data });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const result = await settingsService.updateUser(req.params.id, req.body);
  if (!result) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, data: result.data });
});

export const deleteSettings = asyncHandler(async (req, res) => {
  const removed = await settingsService.removeUser(req.params.id);
  if (!removed) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, message: "Deleted" });
});

export const getGatePass = asyncHandler(async (req, res) => {
  const result = await settingsService.getGatePass(req.params.id);
  if (!result) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, data: result.data });
});

export const verifyGatePass = asyncHandler(async (req, res) => {
  const result = await settingsService.verifyByEmployeeCode(req.params.code);
  if (!result) return res.status(404).json({ success: false, message: "No staff member found for this gate pass code" });
  return res.json({ success: true, data: result.data });
});

export const importUsers = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  const result = await settingsService.importUsers(req.file.buffer.toString("utf-8"));
  return res.json({ success: true, data: result });
});
