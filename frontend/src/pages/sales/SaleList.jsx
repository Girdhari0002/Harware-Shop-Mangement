import { useEffect, useState } from "react";
import api from "../../services/api";
import CrudPage from "../../components/common/CrudPage";
import FormModal from "../../components/common/FormModal";
import FormField from "../../components/common/FormField";
import Button from "../../components/common/Button";
import { saleService } from "../../services/sale.service";

const emptyItem = () => ({ product: "", productName: "", unit: "pcs", qty: 1, price: 0, discountPercent: 0, taxRate: 0, hsnCode: "" });
const empty = { customerName: "Walk-in Customer", customerPhone: "", customerAddress: "", paymentMethod: "cash", paymentStatus: "pending", netAmount: "", notes: "", items: [] };
const itemGross = (it) => Number(it.qty || 0) * Number(it.price || 0);
const itemDiscountAmount = (it) => (itemGross(it) * Number(it.discountPercent || 0)) / 100;
const itemTax = (it) => {
  const lineTotal = itemGross(it) - itemDiscountAmount(it);
  return (lineTotal * Number(it.taxRate || 0)) / 100;
};
const itemAmount = (it) => {
  const lineTotal = itemGross(it) - itemDiscountAmount(it);
  return lineTotal + itemTax(it);
};
const methodOpts = ["cash","upi","bank","credit"].map(m => ({ value: m, label: m.toUpperCase() }));
const statusOpts = [{ value: "pending", label: "Pending" }, { value: "partial", label: "Partial" }, { value: "paid", label: "Paid" }];

const StatusBadge = ({ v }) => {
  const tones = { pending: "warning", partial: "info", paid: "success" };
  return <span className={`erp-badge erp-badge-${tones[v] || "warning"}`}>{v}</span>;
};

const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (v) => `₹${Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const printInvoice = ({ sale, qrSvg, company = {}, amountInWords }) => {
  const win = window.open("", "_blank", "width=860,height=1000");
  if (!win) return;
  const shopName = company.name || "Hardware & Plywood Shop";
  const itemRows = (sale.items || []).length
    ? sale.items.map((it, idx) => `
      <tr>
        <td class="c">${idx + 1}</td>
        <td>${escapeHtml(it.productName)}${it.hsnCode ? `<br/><span class="muted">HSN: ${escapeHtml(it.hsnCode)}</span>` : ""}</td>
        <td class="num">${it.qty} ${escapeHtml(it.unit || "")}</td>
        <td class="num">${money(it.price)}</td>
        <td class="num">${it.discountPercent ? it.discountPercent + "%" : "—"}</td>
        <td class="num">${it.taxRate || 0}%</td>
        <td class="num">${money(it.taxAmount)}</td>
        <td class="num">${money(it.amount)}</td>
      </tr>`).join("")
    : `<tr><td colspan="8" class="muted c">${money(sale.netAmount)} recorded (no line items)</td></tr>`;

  win.document.write(`
    <html>
      <head>
        <title>Invoice ${escapeHtml(sale.invoiceNo)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 28px; color: #172033; max-width: 780px; margin: 0 auto; font-size: 12px; }
          .hdr { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #172033; padding-bottom: 12px; margin-bottom: 16px; }
          .hdr h1 { font-size: 20px; margin: 0; }
          .hdr .title { text-align: right; }
          .hdr .title h2 { font-size: 14px; margin: 0; }
          .hdr .title p { margin: 2px 0 0; color: #555; font-size: 11px; }
          .qr-block { text-align: right; margin-top: 8px; }
          .qr-block svg { width: 90px; height: 90px; }
          .qr-block .qr-label { font-family: monospace; font-size: 11px; letter-spacing: 0.5px; margin-top: 4px; color: #172033; }
          .cols { display: flex; justify-content: space-between; gap: 24px; margin-bottom: 16px; }
          .cols .block { flex: 1; }
          .cols h4 { margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; }
          .cols .right { text-align: right; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { border: 1px solid #d0d7de; padding: 6px 8px; font-size: 11px; text-align: left; vertical-align: top; }
          th { background: #f4f6f9; }
          .num { text-align: right; }
          .c { text-align: center; }
          .muted { color: #888; font-size: 10px; }
          tfoot td { font-weight: bold; border-top: 2px solid #172033; }
          .words { margin-top: 12px; }
          .footer { display: flex; justify-content: space-between; margin-top: 40px; }
          .sign { text-align: right; }
          .sign .line { margin-top: 40px; font-weight: bold; }
          .note { margin-top: 24px; font-size: 10px; color: #666; }
        </style>
      </head>
      <body>
        <div class="hdr">
          <div><h1>${escapeHtml(shopName)}</h1></div>
          <div class="title">
            <h2>Tax Invoice / Bill of Supply</h2>
            <p>(Original for Recipient)</p>
            <div class="qr-block">${qrSvg || ""}<div class="qr-label">${escapeHtml(sale.invoiceNo)}</div></div>
          </div>
        </div>

        <div class="cols">
          <div class="block">
            <h4>Sold By</h4>
            <div>${escapeHtml(shopName)}</div>
            ${company.address ? `<div>${escapeHtml(company.address)}</div>` : ""}
            ${company.gstNumber ? `<div><b>GST Registration No:</b> ${escapeHtml(company.gstNumber)}</div>` : ""}
            ${company.panNumber ? `<div><b>PAN No:</b> ${escapeHtml(company.panNumber)}</div>` : ""}
            ${company.phone ? `<div>Phone: ${escapeHtml(company.phone)}</div>` : ""}
          </div>
          <div class="block right">
            <h4>Billing Address</h4>
            <div>${escapeHtml(sale.customerName || "Walk-in Customer")}</div>
            ${sale.customerAddress ? `<div>${escapeHtml(sale.customerAddress)}</div>` : ""}
            ${sale.customerPhone ? `<div>Phone: ${escapeHtml(sale.customerPhone)}</div>` : ""}
          </div>
        </div>

        <div class="meta">
          <div><b>Invoice Number:</b> ${escapeHtml(sale.invoiceNo)}</div>
          <div><b>Invoice Date:</b> ${new Date(sale.createdAt || sale.date).toLocaleDateString("en-IN")}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="c">SI No</th>
              <th>Description</th>
              <th class="num">Qty</th>
              <th class="num">Unit Price</th>
              <th class="num">Disc</th>
              <th class="num">Tax Rate</th>
              <th class="num">Tax Amount</th>
              <th class="num">Total Amount</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="6" class="num">TOTAL:</td>
              <td class="num">${money(sale.taxAmount)}</td>
              <td class="num">${money(sale.netAmount)}</td>
            </tr>
          </tfoot>
        </table>

        <div class="words"><b>Amount in Words:</b><br/>${escapeHtml(amountInWords)}</div>

        <div class="footer">
          <div>
            <div><b>Payment Method:</b> ${escapeHtml((sale.paymentMethod || "").toUpperCase())}</div>
            <div><b>Payment Status:</b> ${escapeHtml(sale.paymentStatus)}</div>
            ${sale.notes ? `<div><b>Notes:</b> ${escapeHtml(sale.notes)}</div>` : ""}
          </div>
          <div class="sign">
            <div>For ${escapeHtml(shopName)}:</div>
            <div class="line">Authorized Signatory</div>
          </div>
        </div>

        <div class="note">
          Whether tax is payable under reverse charge - No
        </div>

        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `);
  win.document.close();
};

export default function SaleList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", tone: "info" });
  const [printingId, setPrintingId] = useState(null);
  const [products, setProducts] = useState([]);

  const showToast = (message, tone = "info") => {
    setToast({ message, tone });
    setTimeout(() => setToast({ message: "", tone: "info" }), 3000);
  };

  const set = (key) => (v) => setForm(p => ({ ...p, [key]: v }));

  const load = async () => {
    setLoading(true);
    try { const r = await api.get("/sales"); setData(r.data.data || []); }
    catch { showToast("Failed to load", "danger"); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { api.get("/products").then(r => setProducts(r.data.data || [])).catch(() => {}); }, []);

  const openAdd = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = (row) => {
    setForm({
      customerName: row.customerName || "",
      customerPhone: row.customerPhone || "",
      customerAddress: row.customerAddress || "",
      paymentMethod: row.paymentMethod || "cash",
      paymentStatus: row.paymentStatus || "pending",
      netAmount: row.netAmount || "",
      notes: row.notes || "",
      items: (row.items || []).map(it => ({
        product: (it.product && (it.product._id || it.product)) || "",
        productName: it.productName || "",
        unit: it.unit || "pcs",
        qty: it.qty ?? 1,
        price: it.price ?? 0,
        discountPercent: it.discountPercent ?? 0,
        taxRate: it.taxRate ?? 0,
        hsnCode: it.hsnCode || ""
      }))
    });
    setEditId(row._id); setModal(true);
  };

  const addItem = () => setForm(p => ({ ...p, items: [...p.items, emptyItem()] }));
  const removeItem = (idx) => setForm(p => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));
  const updateItem = (idx, patch) => setForm(p => ({ ...p, items: p.items.map((it, i) => i === idx ? { ...it, ...patch } : it) }));
  const selectProduct = (idx, productId) => {
    const prod = products.find(p => p._id === productId);
    updateItem(idx, prod
      ? { product: prod._id, productName: prod.name, unit: prod.unit, price: prod.sellPrice, discountPercent: prod.discountPercent || 0, taxRate: prod.gstPercent, hsnCode: prod.hsnCode || "" }
      : { product: "", productName: "" });
  };

  const itemsSubtotal = form.items.reduce((s, it) => s + itemGross(it), 0);
  const itemsDiscountTotal = form.items.reduce((s, it) => s + itemDiscountAmount(it), 0);
  const itemsTaxTotal = form.items.reduce((s, it) => s + itemTax(it), 0);
  const itemsNetTotal = itemsSubtotal - itemsDiscountTotal + itemsTaxTotal;

  const handlePrint = async (row) => {
    setPrintingId(row._id);
    try {
      const res = await saleService.invoice(row._id);
      printInvoice(res.data.data);
    } catch {
      showToast("Failed to load invoice", "danger");
    } finally {
      setPrintingId(null);
    }
  };

  const handleSave = async () => {
    const hasItems = form.items.length > 0;
    if (!hasItems && !form.netAmount) return showToast("Amount is required (or add at least one item)", "warning");
    if (hasItems && form.items.some(it => !it.productName || !(Number(it.qty) > 0) || Number(it.price) < 0)) {
      return showToast("Each item needs a product, quantity, and price", "warning");
    }
    setSaving(true);
    try {
      const base = { customerName: form.customerName, customerPhone: form.customerPhone, customerAddress: form.customerAddress, paymentMethod: form.paymentMethod, paymentStatus: form.paymentStatus, notes: form.notes };
      const payload = hasItems
        ? { ...base, items: form.items.map(it => ({ product: it.product || null, productName: it.productName, hsnCode: it.hsnCode || "", qty: Number(it.qty), unit: it.unit || "pcs", price: Number(it.price), discountPercent: Number(it.discountPercent || 0), discount: itemDiscountAmount(it), taxRate: Number(it.taxRate || 0) })) }
        : { ...base, netAmount: form.netAmount, items: [] };
      editId ? await api.put(`/sales/${editId}`, payload) : await api.post("/sales", payload);
      showToast(editId ? "Sale updated!" : "Sale recorded!", "success"); setModal(false); load();
    } catch (e) { showToast(e?.response?.data?.message || "Error saving", "danger"); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => { await api.delete(`/sales/${id}`); showToast("Deleted!", "success"); load(); };

  const columns = [
    { key: "invoiceNo", label: "Invoice No", render: v => <span className="font-mono text-primary">{v || "—"}</span> },
    { key: "customerName", label: "Customer" },
    { key: "netAmount", label: "Amount", render: v => <span className="font-semibold text-success">₹{Number(v || 0).toLocaleString("en-IN")}</span> },
    { key: "paymentStatus", label: "Status", render: (v) => <StatusBadge v={v} /> },
    { key: "paymentMethod", label: "Method", render: v => v?.toUpperCase() },
    { key: "createdAt", label: "Date", render: v => new Date(v).toLocaleDateString("en-IN") },
  ];

  return (
    <>
      {toast.message && <div className="fixed top-5 right-5 z-50"><div className={`erp-card border px-4 py-3 text-sm shadow-[0_10px_40px_rgba(23,32,51,0.15)] animate-in slide-in-from-top-2 fade-in-0 duration-200 ${toast.tone === "success" ? "border-success/30 bg-success-light text-success" : toast.tone === "danger" ? "border-danger/30 bg-danger-light text-danger" : toast.tone === "warning" ? "border-warning/30 bg-warning-light text-warning" : "border-primary/30 bg-primary-light text-primary"}`}>{toast.message}</div></div>}
      <CrudPage
        title="Sales"
        subtitle="Manage sales transactions"
        columns={columns}
        data={data}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        addLabel="New Sale"
        extraActions={(row) => (
          <Button variant="ghost" size="sm" onClick={() => handlePrint(row)} disabled={printingId === row._id} className="h-8 px-2 py-0">
            {printingId === row._id ? "Loading..." : "🖨️ Invoice"}
          </Button>
        )}
      />
      <FormModal open={modal} title={editId ? "Edit Sale" : "New Sale"} onClose={() => setModal(false)} onSubmit={handleSave} loading={saving} size="lg">
        <FormField label="Customer Name" id="customerName" value={form.customerName} onChange={set("customerName")} placeholder="Walk-in Customer" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Customer Phone" id="customerPhone" value={form.customerPhone} onChange={set("customerPhone")} placeholder="e.g. 9876543210" />
          <FormField label="Customer Address" id="customerAddress" value={form.customerAddress} onChange={set("customerAddress")} placeholder="e.g. Main Bazaar, Surat" />
        </div>

        <div className="space-y-2 mt-2">
          <div className="flex items-center justify-between">
            <label className="erp-label">Items (pick from inventory)</label>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>+ Add Item</Button>
          </div>
          {form.items.length > 0 && (
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-background">
                  <tr>
                    <th className="text-left p-2">Product</th>
                    <th className="text-right p-2 w-20">Qty</th>
                    <th className="text-right p-2 w-24">Price (₹)</th>
                    <th className="text-right p-2 w-20">Disc %</th>
                    <th className="text-right p-2 w-16">Tax %</th>
                    <th className="text-right p-2 w-24">Amount</th>
                    <th className="p-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {form.items.map((it, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="p-2 min-w-[160px]">
                        <select className="erp-input" value={it.product} onChange={(e) => selectProduct(idx, e.target.value)}>
                          <option value="">— Select product —</option>
                          {products.map(p => <option key={p._id} value={p._id}>{p.name}{p.sku ? ` (${p.sku})` : ""}</option>)}
                        </select>
                      </td>
                      <td className="p-2"><input type="number" min="0" className="erp-input text-right" value={it.qty} onChange={(e) => updateItem(idx, { qty: e.target.value })} /></td>
                      <td className="p-2"><input type="number" min="0" className="erp-input text-right" value={it.price} onChange={(e) => updateItem(idx, { price: e.target.value })} /></td>
                      <td className="p-2"><input type="number" min="0" max="100" className="erp-input text-right" value={it.discountPercent} onChange={(e) => updateItem(idx, { discountPercent: e.target.value })} /></td>
                      <td className="p-2"><input type="number" min="0" className="erp-input text-right" value={it.taxRate} onChange={(e) => updateItem(idx, { taxRate: e.target.value })} /></td>
                      <td className="p-2 text-right font-medium">₹{itemAmount(it).toFixed(2)}</td>
                      <td className="p-2 text-center">
                        <button type="button" onClick={() => removeItem(idx)} className="text-danger hover:opacity-70" aria-label="Remove item">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-wrap justify-end gap-x-6 gap-y-1 p-3 bg-background text-sm border-t border-border">
                <span>Subtotal: <strong>₹{itemsSubtotal.toFixed(2)}</strong></span>
                {itemsDiscountTotal > 0 && <span>Discount: <strong>-₹{itemsDiscountTotal.toFixed(2)}</strong></span>}
                <span>Tax: <strong>₹{itemsTaxTotal.toFixed(2)}</strong></span>
                <span>Net: <strong className="text-success">₹{itemsNetTotal.toFixed(2)}</strong></span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {form.items.length === 0 ? (
            <FormField label="Net Amount (₹)" id="netAmount" type="number" value={form.netAmount} onChange={set("netAmount")} required placeholder="0" />
          ) : (
            <div className="space-y-1.5">
              <label className="erp-label">Net Amount (₹)</label>
              <div className="erp-input bg-background text-text-secondary flex items-center">₹{itemsNetTotal.toFixed(2)} (from items)</div>
            </div>
          )}
          <FormField label="Payment Method" id="paymentMethod" type="select" value={form.paymentMethod} onChange={set("paymentMethod")} options={methodOpts} />
          <FormField label="Payment Status" id="paymentStatus" type="select" value={form.paymentStatus} onChange={set("paymentStatus")} options={statusOpts} />
        </div>
        <FormField label="Notes" id="notes" type="textarea" value={form.notes} onChange={set("notes")} placeholder="Optional notes" rows={2} />
      </FormModal>
    </>
  );
}