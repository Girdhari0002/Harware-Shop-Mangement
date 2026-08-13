import { Router } from "express";
import { createInvoice, deleteInvoice, getInvoiceById, listInvoice, updateInvoice, verifyInvoice } from "../controllers/invoice.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Public — used by the unauthenticated invoice verification page.
router.get("/verify/:invoiceNumber", verifyInvoice);

router.use(authenticate);
router.get("/", listInvoice);
router.get("/:id", getInvoiceById);
router.post("/", createInvoice);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;
