import { Router } from "express";
import { getCompanyProfile, getPublicCompanyProfile, updateCompanyProfile } from "../controllers/company.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Unauthenticated — needed to render the logo/name on the login and landing pages.
router.get("/public", getPublicCompanyProfile);

router.use(authenticate, authorizeRoles("admin"));
router.get("/", getCompanyProfile);
router.put("/", upload.single("logo"), updateCompanyProfile);

export default router;
