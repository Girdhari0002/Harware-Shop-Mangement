import { asyncHandler } from "../utils/asyncHandler.js";
import { reportService } from "../services/report.service.js";

export const salesReport = asyncHandler(async (req, res) => {
  const data = await reportService.salesReport(req.query);
  res.json({ success: true, data });
});

export const purchaseReport = asyncHandler(async (req, res) => {
  const data = await reportService.purchaseReport(req.query);
  res.json({ success: true, data });
});

export const gstReport = asyncHandler(async (req, res) => {
  const data = await reportService.gstReport(req.query);
  res.json({ success: true, data });
});

export const stockReport = asyncHandler(async (req, res) => {
  const data = await reportService.stockReport();
  res.json({ success: true, data });
});

export const profitReport = asyncHandler(async (req, res) => {
  const data = await reportService.profitReport(req.query);
  res.json({ success: true, data });
});

export const topProducts = asyncHandler(async (req, res) => {
  const data = await reportService.topProducts(req.query);
  res.json({ success: true, data });
});

export const bestCustomers = asyncHandler(async (req, res) => {
  const data = await reportService.bestCustomers(req.query);
  res.json({ success: true, data });
});

export const customerLedger = asyncHandler(async (req, res) => {
  const data = await reportService.customerLedger(req.params.id);
  res.json({ success: true, data });
});

export const supplierLedger = asyncHandler(async (req, res) => {
  const data = await reportService.supplierLedger(req.params.id);
  res.json({ success: true, data });
});
