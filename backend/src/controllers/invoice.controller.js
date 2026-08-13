import { asyncHandler } from "../utils/asyncHandler.js";
import { invoiceService } from "../services/invoice.service.js";
import { companyService } from "../services/company.service.js";

export const listInvoice = asyncHandler(async (req, res) => {
  const { data } = await invoiceService.list();
  res.json({ success: true, data });
});

export const getInvoiceById = asyncHandler(async (req, res) => {
  const found = await invoiceService.getById(req.params.id);
  if (!found) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: found.data });
});

export const createInvoice = asyncHandler(async (req, res) => {
  const { saleId, purchaseId } = req.body;
  if (!saleId && !purchaseId) {
    return res.status(400).json({ success: false, message: "saleId or purchaseId is required" });
  }
  const { data } = saleId
    ? await invoiceService.generateFromSale(saleId)
    : await invoiceService.generateFromPurchase(purchaseId);
  res.status(201).json({ success: true, data });
});

export const updateInvoice = asyncHandler(async (req, res) => {
  res.status(405).json({ success: false, message: "Invoices are generated from sales/purchases and cannot be edited directly." });
});

export const deleteInvoice = asyncHandler(async (req, res) => {
  const removed = await invoiceService.remove(req.params.id);
  if (!removed) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, message: "Deleted" });
});

// Public endpoint — no auth required, used by the customer-facing invoice verification page.
export const verifyInvoice = asyncHandler(async (req, res) => {
  const { invoiceNumber } = req.params;
  const result = await invoiceService.verify(invoiceNumber);
  if (!result.valid) {
    return res.status(404).json({ success: false, message: "Invoice not found" });
  }
  const { data } = result;
  const { data: settings } = await companyService.get();
  res.json({
    success: true,
    data: {
      invoiceNo: data.invoiceNo,
      date: data.date,
      businessName: settings?.company?.name || "Hardware & Plywood Shop",
      customerName: data.party,
      totalAmount: data.netAmount,
      paymentStatus: data.paymentStatus ? data.paymentStatus[0].toUpperCase() + data.paymentStatus.slice(1) : "Paid",
      verificationStatus: "Verified",
      items: (data.items || []).map((i) => ({ name: i.description, qty: i.qty, rate: i.price, amount: i.amount }))
    }
  });
});
