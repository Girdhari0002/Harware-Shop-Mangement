import { Router } from "express";
import authRoutes from "./auth.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import brandRoutes from "./brand.routes.js";
import supplierRoutes from "./supplier.routes.js";
import customerRoutes from "./customer.routes.js";
import purchaseRoutes from "./purchase.routes.js";
import saleRoutes from "./sale.routes.js";
import expenseRoutes from "./expense.routes.js";
import paymentRoutes from "./payment.routes.js";
import settingsRoutes from "./settings.routes.js";
import reportRoutes from "./report.routes.js";
import notificationRoutes from "./notification.routes.js";
import searchRoutes from "./search.routes.js";
import invoiceRoutes from "./invoice.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import companyRoutes from "./company.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "ERP API is running" });
});

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/customers", customerRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/sales", saleRoutes);
router.use("/expenses", expenseRoutes);
router.use("/payments", paymentRoutes);
router.use("/settings", settingsRoutes);
router.use("/reports", reportRoutes);
router.use("/notifications", notificationRoutes);
router.use("/search", searchRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/company", companyRoutes);

export default router;