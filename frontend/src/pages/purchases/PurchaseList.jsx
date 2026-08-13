import { useEffect, useState } from "react";
import api from "../../services/api";
import CrudPage from "../../components/common/CrudPage";
import FormModal from "../../components/common/FormModal";
import FormField from "../../components/common/FormField";
import SearchSelect from "../../components/common/SearchSelect";

const empty = { supplier: "", supplierName: "", billNo: "", paymentMethod: "cash", paymentStatus: "pending", netAmount: "", notes: "" };
const methodOpts = ["cash","upi","bank","credit"].map(m => ({ value: m, label: m.toUpperCase() }));
const statusOpts = [{ value: "pending", label: "Pending" }, { value: "partial", label: "Partial" }, { value: "paid", label: "Paid" }];

const StatusBadge = ({ v }) => {
  const tones = { pending: "warning", partial: "info", paid: "success" };
  return <span className={`erp-badge erp-badge-${tones[v] || "warning"}`}>{v}</span>;
};

export default function PurchaseList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", tone: "info" });
  const [suppliers, setSuppliers] = useState([]);

  const showToast = (message, tone = "info") => {
    setToast({ message, tone });
    setTimeout(() => setToast({ message: "", tone: "info" }), 3000);
  };

  const set = (key) => (v) => setForm(p => ({ ...p, [key]: v }));

  const load = async () => {
    setLoading(true);
    try { const r = await api.get("/purchases"); setData(r.data.data || []); }
    catch { showToast("Failed to load", "danger"); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { api.get("/suppliers").then(r => setSuppliers(r.data.data || [])).catch(() => {}); }, []);

  const openAdd = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = (row) => {
    setForm({
      supplier: (row.supplier && (row.supplier._id || row.supplier)) || "",
      supplierName: row.supplierName || "",
      billNo: row.billNo || "",
      paymentMethod: row.paymentMethod || "cash",
      paymentStatus: row.paymentStatus || "pending",
      netAmount: row.netAmount || "",
      notes: row.notes || ""
    });
    setEditId(row._id); setModal(true);
  };

  const selectSupplier = (id, supplier) => setForm(p => ({ ...p, supplier: id, supplierName: supplier?.name || "" }));

  const handleSave = async () => {
    if (!form.netAmount) return showToast("Amount is required", "warning");
    setSaving(true);
    try {
      editId ? await api.put(`/purchases/${editId}`, form) : await api.post("/purchases", form);
      showToast(editId ? "Purchase updated!" : "Purchase recorded!", "success"); setModal(false); load();
    } catch (e) { showToast(e?.response?.data?.message || "Error saving", "danger"); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => { await api.delete(`/purchases/${id}`); showToast("Deleted!", "success"); load(); };

  const columns = [
    { key: "billNo", label: "Bill No", render: v => <span className="font-mono text-warning">{v || "—"}</span> },
    { key: "supplierName", label: "Supplier" },
    { key: "netAmount", label: "Amount", render: v => <span className="font-semibold text-warning">₹{Number(v || 0).toLocaleString("en-IN")}</span> },
    { key: "paymentStatus", label: "Status", render: (v) => <StatusBadge v={v} /> },
    { key: "paymentMethod", label: "Method", render: v => v?.toUpperCase() },
    { key: "createdAt", label: "Date", render: v => new Date(v).toLocaleDateString("en-IN") },
  ];

  return (
    <>
      {toast.message && <div className="fixed top-5 right-5 z-50"><div className={`erp-card border px-4 py-3 text-sm shadow-[0_10px_40px_rgba(23,32,51,0.15)] animate-in slide-in-from-top-2 fade-in-0 duration-200 ${toast.tone === "success" ? "border-success/30 bg-success-light text-success" : toast.tone === "danger" ? "border-danger/30 bg-danger-light text-danger" : toast.tone === "warning" ? "border-warning/30 bg-warning-light text-warning" : "border-primary/30 bg-primary-light text-primary"}`}>{toast.message}</div></div>}
      <CrudPage title="Purchases" subtitle="Manage purchase transactions" columns={columns} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} addLabel="New Purchase" />
      <FormModal open={modal} title={editId ? "Edit Purchase" : "New Purchase"} onClose={() => setModal(false)} onSubmit={handleSave} loading={saving}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchSelect
            label="Supplier Name"
            id="supplierName"
            value={form.supplier}
            onChange={selectSupplier}
            options={suppliers}
            getLabel={(s) => s.name}
            getSubLabel={(s) => s.phone || s.email || ""}
            placeholder="Search supplier..."
          />
          <FormField label="Bill No" id="billNo" value={form.billNo} onChange={set("billNo")} placeholder="e.g. BILL-001" />
          <FormField label="Net Amount (₹)" id="netAmount" type="number" value={form.netAmount} onChange={set("netAmount")} required placeholder="0" />
          <FormField label="Payment Method" id="paymentMethod" type="select" value={form.paymentMethod} onChange={set("paymentMethod")} options={methodOpts} />
          <FormField label="Payment Status" id="paymentStatus" type="select" value={form.paymentStatus} onChange={set("paymentStatus")} options={statusOpts} />
        </div>
        <FormField label="Notes" id="notes" type="textarea" value={form.notes} onChange={set("notes")} placeholder="Optional notes" rows={2} />
      </FormModal>
    </>
  );
}