import { Invoice } from "../models/Invoice.model.js";
import { Sale } from "../models/Sale.model.js";
import { Purchase } from "../models/Purchase.model.js";
import { demoStore } from "../utils/demoStore.js";
import { useDemoData } from "../utils/demoData.js";

const coll = "invoices";

const buildInvoice = (doc, type) => ({
  invoiceNo: doc.invoiceNo || doc.billNo,
  type,
  reference: doc._id,
  referenceModel: type === "sale" ? "Sale" : "Purchase",
  date: doc.date,
  party: type === "sale"
    ? (doc.customer?.name || doc.customerName || "Walk-in Customer")
    : (doc.supplier?.name || doc.supplierName || "Unknown Supplier"),
  items: (doc.items || []).map((i) => ({
    description: i.productName || i.name || "",
    hsnCode: i.hsnCode || "",
    qty: i.qty,
    unit: i.unit,
    price: i.price,
    taxRate: i.taxRate,
    taxAmount: i.taxAmount,
    amount: i.amount
  })),
  subtotal: doc.subtotal,
  taxAmount: doc.taxAmount,
  netAmount: doc.netAmount,
  status: "generated"
});

export const invoiceService = {
  async generateFromSale(saleId) {
    const sale = useDemoData() ? demoStore.get("sales", saleId) : await Sale.findById(saleId);
    if (!sale) { const e = new Error("Sale not found"); e.statusCode = 404; throw e; }
    const data = buildInvoice(sale, "sale");
    if (useDemoData()) return { data: demoStore.create(coll, data) };
    return { data: await Invoice.create(data) };
  },
  async generateFromPurchase(purchaseId) {
    const purchase = useDemoData() ? demoStore.get("purchases", purchaseId) : await Purchase.findById(purchaseId);
    if (!purchase) { const e = new Error("Purchase not found"); e.statusCode = 404; throw e; }
    const data = buildInvoice(purchase, "purchase");
    if (useDemoData()) return { data: demoStore.create(coll, data) };
    return { data: await Invoice.create(data) };
  },
  async list() {
    if (useDemoData()) return { data: demoStore.findAll(coll) };
    return { data: await Invoice.find().sort("-createdAt") };
  },
  async getById(id) {
    if (useDemoData()) { const i = demoStore.get(coll, id); return i ? { data: i } : null; }
    const i = await Invoice.findById(id);
    return i ? { data: i } : null;
  },
  async getByInvoiceNo(invoiceNo) {
    if (useDemoData()) { const i = demoStore.findOne(coll, (x) => x.invoiceNo === invoiceNo); return i ? { data: i } : null; }
    const i = await Invoice.findOne({ invoiceNo });
    return i ? { data: i } : null;
  },
  async verify(invoiceNo) {
    // Check the live Sale/Purchase records first — they carry the invoice number as soon as they're
    // created, whereas a separate Invoice record only exists if someone explicitly generated one.
    const sale = useDemoData()
      ? demoStore.findOne("sales", (s) => s.invoiceNo === invoiceNo)
      : await Sale.findOne({ invoiceNo });
    if (sale) return { valid: true, data: buildInvoice(sale, "sale") };

    const purchase = useDemoData()
      ? demoStore.findOne("purchases", (p) => p.billNo === invoiceNo)
      : await Purchase.findOne({ billNo: invoiceNo });
    if (purchase) return { valid: true, data: buildInvoice(purchase, "purchase") };

    const found = await this.getByInvoiceNo(invoiceNo);
    return found ? { valid: true, data: found.data } : { valid: false };
  },
  async remove(id) {
    if (useDemoData()) return demoStore.remove(coll, id);
    const r = await Invoice.deleteOne({ _id: id });
    return r.deletedCount > 0;
  }
};
