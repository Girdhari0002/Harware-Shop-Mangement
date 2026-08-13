import { Router } from "express";
import { globalSearch, searchByBarcode } from "../controllers/search.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticate);

router.get("/", globalSearch);
router.get("/barcode/:barcode", searchByBarcode);

export default router;
