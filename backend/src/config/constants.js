export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff"
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PARTIAL: "partial",
  PAID: "paid"
};

export const PAYMENT_METHOD = {
  CASH: "cash",
  UPI: "upi",
  BANK: "bank",
  CHEQUE: "cheque",
  CREDIT: "credit"
};

export const UNIT_TYPES = ["pcs", "kg", "m", "sqft", "sheet", "box", "ltr"];

export const EXPENSE_CATEGORIES = ["rent", "salary", "transport", "utilities", "maintenance", "marketing", "misc"];

export const PRODUCT_UNITS = UNIT_TYPES;

export const GST_RATES = [0, 5, 12, 18, 28];

export const INVOICE_STATUS = {
  DRAFT: "draft",
  GENERATED: "generated",
  PDF: "pdf",
  SHARED: "shared"
};

export const NOTIFICATION_TYPES = ["low_stock", "out_of_stock", "payment_due", "pending_bill", "backup_reminder", "system"];
