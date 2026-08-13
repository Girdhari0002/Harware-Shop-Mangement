import { Router } from "express";
import { bestCustomers, customerLedger, gstReport, profitReport, purchaseReport, salesReport, stockReport, supplierLedger, topProducts } from "../controllers/report.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();
router.use(authenticate);
router.use(authorizeRoles("admin"));

router.get("/sales", salesReport);
router.get("/purchases", purchaseReport);
router.get("/gst", gstReport);
router.get("/stock", stockReport);
router.get("/profit", profitReport);
router.get("/top-products", topProducts);
router.get("/best-customers", bestCustomers);
router.get("/customer-ledger/:id", customerLedger);
router.get("/supplier-ledger/:id", supplierLedger);

export default router;
