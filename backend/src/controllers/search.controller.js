import { asyncHandler } from "../utils/asyncHandler.js";
import { searchService } from "../services/search.service.js";

export const globalSearch = asyncHandler(async (req, res) => {
  const data = await searchService.global(req.query.q);
  res.json({ success: true, data });
});

export const searchByBarcode = asyncHandler(async (req, res) => {
  const data = await searchService.byBarcode(req.params.barcode);
  res.json({ success: true, data });
});
