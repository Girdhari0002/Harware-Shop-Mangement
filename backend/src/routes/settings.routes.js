import { Router } from "express";
import { createSettings, deleteSettings, getGatePass, getSettingsById, importUsers, listSettings, updateSettings, verifyGatePass } from "../controllers/settings.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { memoryUpload } from "../middlewares/upload.middleware.js";
const router = Router();
router.use(authenticate);

// Gate-pass verification — any logged-in staff/admin can verify a badge scanned at the gate.
router.get("/verify/:code", verifyGatePass);

router.use(authorizeRoles("admin"));
router.get("/", listSettings);
router.get("/:id", getSettingsById);
router.get("/:id/gatepass", getGatePass);
router.post("/", createSettings);
router.post("/import", memoryUpload.single("file"), importUsers);
router.put("/:id", updateSettings);
router.delete("/:id", deleteSettings);
export default router;
