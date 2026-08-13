import { useEffect, useState } from "react";
import api from "../../services/api";
import CrudPage from "../../components/common/CrudPage";
import FormModal from "../../components/common/FormModal";
import FormField from "../../components/common/FormField";

const today = new Date().toISOString().split("T")[0];
const empty = { partyType: "customer", partyName: "", amount: "", date: today, paymentMethod: "cash", reference: "", notes: "" };
const methodOpts = ["cash","upi","bank","cheque"].map(m => ({ value: m, label: m.toUpperCase() }));
const partyOpts = [{ value: "customer", label: "Customer" }, { value: "supplier", label: "Supplier" }];

const PartyBadge = ({ type }) => (
  <span className={`erp-badge ${type === "customer" ? "erp-badge-primary" : "erp-badge-warning"}`}>
    {type === "customer" ? "Customer" : "Supplier"}
  </span>
);

const MethodBadge = ({ method }) => {
  const colors = { cash: "success", upi: "primary", bank: "warning", cheque: "info" };
  return <span className={`erp-badge erp-badge-${colors[method] || "secondary"}`}>{method?.toUpperCase()}</span>;
};

export default function PaymentList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", tone: "info" });

  const showToast = (message, tone = "info") => {
    setToast({ message, tone });
    setTimeout(() => setToast({ message: "", tone: "info" }), 3000);
  };

  const set = (key) => (v) => setForm(p => ({ ...p, [key]: v }));

  const load = async () => {
    setLoading(true);
    try { const r = await api.get("/payments"); setData(r.data.data || []); }
    catch { showToast("Failed to load", "danger"); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ ...empty, date: today }); setEditId(null); setModal(true); };
  const openEdit = (row) => {
    setForm({ partyType: row.partyType, partyName: row.partyName || "", amount: row.amount || "", date: row.date ? row.date.split("T")[0] : today, paymentMethod: row.paymentMethod || "cash", reference: row.reference || "", notes: row.notes || "" });
    setEditId(row._id); setModal(true);
  };

  const handleSave = async () => {
    if (!form.partyName.trim() || !form.amount) return showToast("Party name and amount are required", "warning");
    setSaving(true);
    try {
      editId ? await api.put(`/payments/${editId}`, form) : await api.post("/payments", form);
      showToast(editId ? "Payment updated!" : "Payment recorded!", "success"); setModal(false); load();
    } catch (e) { showToast(e?.response?.data?.message || "Error saving", "danger"); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => { await api.delete(`/payments/${id}`); showToast("Deleted!", "success"); load(); };

  const columns = [
    { key: "partyName", label: "Party Name" },
    { key: "partyType", label: "Type", render: (v) => <PartyBadge type={v} /> },
    { key: "amount", label: "Amount", render: v => <span className="font-semibold text-text-primary">₹{Number(v).toLocaleString("en-IN")}</span> },
    { key: "paymentMethod", label: "Method", render: (v) => <MethodBadge method={v} /> },
    { key: "date", label: "Date", render: v => new Date(v).toLocaleDateString("en-IN") },
    { key: "reference", label: "Reference", render: v => v || "—" },
  ];

  return (
    <>
      {toast.message && <div className="fixed top-5 right-5 z-50"><div className={`erp-card border px-4 py-3 text-sm shadow-[0_10px_40px_rgba(23,32,51,0.15)] animate-in slide-in-from-top-2 fade-in-0 duration-200 ${toast.tone === "success" ? "border-success/30 bg-success-light text-success" : toast.tone === "danger" ? "border-danger/30 bg-danger-light text-danger" : toast.tone === "warning" ? "border-warning/30 bg-warning-light text-warning" : "border-primary/30 bg-primary-light text-primary"}`}>{toast.message}</div></div>}
      <CrudPage title="Payments" subtitle="Track payments received and made" columns={columns} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} addLabel="Record Payment" />
      <FormModal open={modal} title={editId ? "Edit Payment" : "Record Payment"} onClose={() => setModal(false)} onSubmit={handleSave} loading={saving} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Party Type" id="partyType" type="select" value={form.partyType} onChange={set("partyType")} options={partyOpts} />
          <FormField label="Party Name" id="partyName" value={form.partyName} onChange={set("partyName")} required placeholder="Customer or Supplier name" />
          <FormField label="Amount (₹)" id="amount" type="number" value={form.amount} onChange={set("amount")} required placeholder="0" />
          <FormField label="Payment Method" id="paymentMethod" type="select" value={form.paymentMethod} onChange={set("paymentMethod")} options={methodOpts} />
          <FormField label="Date" id="date" type="date" value={form.date} onChange={set("date")} />
          <FormField label="Reference / Cheque No" id="reference" value={form.reference} onChange={set("reference")} placeholder="Optional reference" />
        </div>
        <FormField label="Notes" id="notes" type="textarea" value={form.notes} onChange={set("notes")} placeholder="Optional notes" rows={2} />
      </FormModal>
    </>
  );
}