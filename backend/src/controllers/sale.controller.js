import { crudController } from "./_crud.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { saleService } from "../services/sale.service.js";
export const { listSale, getSaleById, createSale, updateSale, deleteSale } = crudController(saleService, "Sale");

export const getSaleInvoice = asyncHandler(async (req, res) => {
  const result = await saleService.getInvoice(req.params.id);
  if (!result) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, data: result.data });
});
