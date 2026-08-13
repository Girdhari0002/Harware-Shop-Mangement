import { asyncHandler } from "../utils/asyncHandler.js";
import { companyService } from "../services/company.service.js";

const COMPANY_FIELDS = ["name", "logo", "phone", "email", "address", "pinCode", "gstNumber", "gstType", "panNumber", "invoicePrefix", "invoiceStartNumber"];

// Public: only branding info needed to render logo/name on unauthenticated pages (login, landing).
export const getPublicCompanyProfile = asyncHandler(async (req, res) => {
  const { data } = await companyService.get();
  return res.json({
    success: true,
    data: { name: data?.company?.name || "", logo: data?.company?.logo || "" }
  });
});

// Admin: full settings document, for the Company Profile settings page.
export const getCompanyProfile = asyncHandler(async (req, res) => {
  const { data } = await companyService.get();
  return res.json({ success: true, data });
});

export const updateCompanyProfile = asyncHandler(async (req, res) => {
  const { data: current } = await companyService.get();
  const body = { ...req.body };
  const company = { ...(current?.company?.toObject?.() ?? current?.company ?? {}), ...(body.company || {}) };

  COMPANY_FIELDS.forEach((key) => {
    if (body[key] !== undefined) company[key] = body[key];
  });

  if (req.file) {
    company.logo = `/uploads/${req.file.filename}`;
  }

  const payload = { ...body, company };
  COMPANY_FIELDS.forEach((key) => delete payload[key]);

  const result = await companyService.update(payload);
  return res.json({ success: true, data: result.data });
});
