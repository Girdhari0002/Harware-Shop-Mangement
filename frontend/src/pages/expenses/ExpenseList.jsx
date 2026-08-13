import { useEffect, useState } from "react";
import api from "../../services/api";
import CrudPage from "../../components/common/CrudPage";
import FormModal from "../../components/common/FormModal";
import FormField from "../../components/common/FormField";

const today = new Date().toISOString().split("T")[0];
const empty = { title: "", amount: "", category: "misc", date: today, notes: "" };
const cats = ["rent","salary","transport","utilities","maintenance","marketing","misc"].map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));

const CategoryBadge = ({ category }) => {
  const colors = {
    rent: "primary",
    salary: "success",
    transport: "warning",
    utilities: "info",
    maintenance: "info",
    marketing: "danger",
    misc: "secondary",
  };
  return <span className={`erp-badge erp-badge-${colors[category] || "secondary"}`}>{category}</span>;
};

export default function ExpenseList() {
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
    try { const r = await api.get("/expenses"); setData(r.data.data || []); }
    catch { showToast("Failed to load", "danger"); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ ...empty, date: today }); setEditId(null); setModal(true); };
  const openEdit = (row) => {
    setForm({ title: row.title, amount: row.amount || "", category: row.category || "misc", date: row.date ? row.date.split("T")[0] : today, notes: row.notes || "" });
    setEditId(row._id); setModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.amount) return showToast("Title and amount are required", "warning");
    setSaving(true);
    try {
      editId ? await api.put(`/expenses/${editId}`, form) : await api.post("/expenses", form);
      showToast(editId ? "Expense updated!" : "Expense added!", "success"); setModal(false); load();
    } catch (e) { showToast(e?.response?.data?.message || "Error saving", "danger"); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => { await api.delete(`/expenses/${id}`); showToast("Deleted!", "success"); load(); };

  const columns = [
    { key: "title", label: "Title" },
    { key: "amount", label: "Amount", render: v => <span className="font-semibold text-danger">₹{Number(v).toLocaleString("en-IN")}</span> },
    { key: "category", label: "Category", render: (v) => <CategoryBadge category={v} /> },
    { key: "date", label: "Date", render: v => new Date(v).toLocaleDateString("en-IN") },
    { key: "notes", label: "Notes", render: v => v || "—" },
  ];

  return (
    <>
      {toast.message && <div className="fixed top-5 right-5 z-50"><div className={`erp-card border px-4 py-3 text-sm shadow-[0_10px_40px_rgba(23,32,51,0.15)] animate-in slide-in-from-top-2 fade-in-0 duration-200 ${toast.tone === "success" ? "border-success/30 bg-success-light text-success" : toast.tone === "danger" ? "border-danger/30 bg-danger-light text-danger" : toast.tone === "warning" ? "border-warning/30 bg-warning-light text-warning" : "border-primary/30 bg-primary-light text-primary"}`}>{toast.message}</div></div>}
      <CrudPage title="Expenses" subtitle="Track business expenses" columns={columns} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} addLabel="Add Expense" />
      <FormModal open={modal} title={editId ? "Edit Expense" : "Add Expense"} onClose={() => setModal(false)} onSubmit={handleSave} loading={saving}>
        <FormField label="Title" id="title" value={form.title} onChange={set("title")} required placeholder="e.g. Monthly Rent" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Amount (₹)" id="amount" type="number" value={form.amount} onChange={set("amount")} required placeholder="0" />
          <FormField label="Category" id="category" type="select" value={form.category} onChange={set("category")} options={cats} />
          <FormField label="Date" id="date" type="date" value={form.date} onChange={set("date")} />
        </div>
        <FormField label="Notes" id="notes" type="textarea" value={form.notes} onChange={set("notes")} placeholder="Optional notes" rows={2} />
      </FormModal>
    </>
  );
}