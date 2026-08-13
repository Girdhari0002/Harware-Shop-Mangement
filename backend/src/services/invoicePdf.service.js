import { numberToWords } from "../utils/numberToWords.js";
import { generateBarcodeSvg, generateQrSvg } from "./barcode.service.js";

const fmt = (n) => (Number(n) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateStr = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "");

export const invoicePdfService = {
  async generateInvoiceHtml(doc, company = {}) {
    const c = company.company || company;
    const items = doc.items || [];
    const logoUrl = c.logo || "";
    const qrSvg = await generateQrSvg(`${doc.invoiceNo}`);
    const rows = items.map((i, idx) => `
      <tr>
        <td class="b">${idx + 1}</td>
        <td class="b">${i.description || i.name || ""}</td>
        <td class="b">${i.hsnCode || ""}</td>
        <td class="b r">${i.qty}</td>
        <td class="b">${i.unit || ""}</td>
        <td class="b r">${fmt(i.price)}</td>
        <td class="b r">${fmt(i.discount || 0)}</td>
        <td class="b r">${i.taxRate || 0}%</td>
        <td class="b r">${fmt(i.taxAmount || 0)}</td>
        <td class="b r">${fmt(i.amount)}</td>
      </tr>`).join("");
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:Arial, sans-serif;margin:24px;color:#172033}
      .hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
      .logo{width:64px;height:64px;background:#eef;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#666}
      .title{font-size:20px;font-weight:bold}
      table{border-collapse:collapse;width:100%;margin-top:12px}
      th,td{border:1px solid #d0d7de;padding:6px 8px;text-align:left;font-size:11px}
      th{bg:#f4f6f9}
      .r{text-align:right}
      .total td{border-top:2px solid #172033}
      .box{border:1px solid #d0d7de;border-radius:8px;padding:12px;margin-top:16px}
      .qr{display:inline-block;vertical-align:top}
    </style></head><body>
      <div class="hdr">
        <div><div class="title">${c.name || "Hardware & Plywood Shop"}</div>
          <div style="font-size:11px;color:#555">${c.address || ""} ${c.gstNumber ? "| GST: " + c.gstNumber : ""}</div>
          <div style="font-size:11px;color:#555">Phone: ${c.phone || ""}  Email: ${c.email || ""}</div>
        </div>
        <div class="logo">${logoUrl ? `<img src="${logoUrl}" style="width:64px;height:64px;object-fit:contain"/>` : "LOGO"}</div>
      </div>
      <div style="margin-top:12px;font-size:12px">
        <div><span style="font-weight:bold">Invoice #:</span> ${doc.invoiceNo || ""}</div>
        <div><span style="font-weight:bold">Date:</span> ${dateStr(doc.date)}</div>
        <div><span style="font-weight:bold">Party:</span> ${doc.party || ""}</div>
        <div style="float:right"><span class="qr">${qrSvg}</span></div>
      </div>
      <table>
        <tr><th>#</th><th>Description</th><th>HSN</th><th class="r">Qty</th><th>Unit</th><th class="r">Rate</th><th class="r">Disc</th><th class="r">GST%</th><th class="r">Tax</th><th class="r">Amount</th></tr>
        ${rows || '<tr><td colspan="10">No items</td></tr>'}
      </table>
      <table class="total">
        <tr><td colspan="8" style="text-align:right;font-weight:bold">Subtotal:</td><td class="r">${fmt(doc.subtotal)}</td></tr>
        <tr><td colspan="8" style="text-align:right">Discount:</td><td class="r">${fmt(doc.discountAmount || 0)}</td></tr>
        <tr><td colspan="8" style="text-align:right">Taxable:</td><td class="r">${fmt(doc.taxableAmount || doc.subtotal)}</td></tr>
        <tr><td colspan="8" style="text-align:right">CGST:</td><td class="r">${fmt(doc.cgstAmount || 0)}</td></tr>
        <tr><td colspan="8" style="text-align:right">SGST:</td><td class="r">${fmt(doc.sgstAmount || 0)}</td></tr>
        <tr><td colspan="8" style="text-align:right">IGST:</td><td class="r">${fmt(doc.igstAmount || 0)}</td></tr>
        <tr><td colspan="8" style="text-align:right;font-weight:bold">Total:</td><td class="r">${fmt(doc.netAmount)}</td></tr>
      </table>
      <div class="box">
        <div style="font-size:11px"><span style="font-weight:bold">Amount in words:</span> ${numberToWords(doc.netAmount)}</div>
        <div style="float:right;font-size:11px;margin-top:24px">Authorized Signatory</div>
      </div>
    </body></html>`;
  }
};
