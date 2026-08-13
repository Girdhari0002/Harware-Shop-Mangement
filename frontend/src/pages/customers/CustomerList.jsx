import { useEffect, useState } from "react";
import api from "../../services/api";
import CrudPage from "../../components/common/CrudPage";
import FormModal from "../../components/common/FormModal";
import FormField from "../../components/common/FormField";
import Button from "../../components/common/Button";
import { printReport } from "../../utils/reportExport";

const empty = { name: "", phone: "", email: "", address: "", gstNumber: "", openingBalance: "", isActive: true };

const ActiveBadge = ({ active }) => (
  <span className={`erp-badge ${active ? "erp-badge-success" : "erp-badge-danger"}`}>
    {active ? "Active" : "Inactive"}
  </span>
);

export default function CustomerList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
    try { const r = await api.get("/customers"); setData(r.data.data || []); }
    catch { showToast("Failed to load", "danger"); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = data.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()) || d.phone?.includes(search));

  const openAdd = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = (row) => { setForm({ name: row.name, phone: row.phone || "", email: row.email || "", address: row.address || "", gstNumber: row.gstNumber || "", openingBalance: row.openingBalance || "", isActive: row.isActive }); setEditId(row._id); setModal(true); };

  const handleSave = async () => {
    if (!form.name.trim()) return showToast("Name is required", "warning");
    setSaving(true);
    try {
      editId ? await api.put(`/customers/${editId}`, form) : await api.post("/customers", form);
      showToast(editId ? "Customer updated!" : "Customer created!", "success"); setModal(false); load();
    } catch (e) { showToast(e?.response?.data?.message || "Error saving", "danger"); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => { await api.delete(`/customers/${id}`); showToast("Deleted!", "success"); load(); };

  const columns = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone", render: v => v || "—" },
    { key: "email", label: "Email", render: v => v || "—" },
    { key: "gstNumber", label: "GST No", render: v => v || "—" },
    { key: "openingBalance", label: "Balance", render: v => `₹${Number(v || 0).toLocaleString("en-IN")}` },
    { key: "isActive", label: "Status", render: (v) => <ActiveBadge active={v} /> },
  ];

  const printColumns = [
    { label: "Name", value: (r) => r.name },
    { label: "Phone", value: (r) => r.phone || "" },
    { label: "Email", value: (r) => r.email || "" },
    { label: "GST No", value: (r) => r.gstNumber || "" },
    { label: "Balance", value: (r) => `₹${Number(r.openingBalance || 0).toLocaleString("en-IN")}` },
    { label: "Status", value: (r) => (r.isActive ? "Active" : "Inactive") },
  ];

  const handlePrint = () => printReport({
    title: "Customers",
    subtitle: `Generated ${new Date().toLocaleString("en-IN")} · ${filtered.length} customer(s)`,
    sections: [{ columns: printColumns, rows: filtered, emptyMessage: "No customers found" }],
  });

  return (
    <>
      {toast.message && <div className="fixed top-5 right-5 z-50"><div className={`erp-card border px-4 py-3 text-sm shadow-[0_10px_40px_rgba(23,32,51,0.15)] animate-in slide-in-from-top-2 fade-in-0 duration-200 ${toast.tone === "success" ? "border-success/30 bg-success-light text-success" : toast.tone === "danger" ? "border-danger/30 bg-danger-light text-danger" : toast.tone === "warning" ? "border-warning/30 bg-warning-light text-warning" : "border-primary/30 bg-primary-light text-primary"}`}>{toast.message}</div></div>}
      <CrudPage
        title="Customers"
        subtitle="Manage your customer records"
        columns={columns}
        data={filtered}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Add Customer"
        headerExtra={
          <Button variant="outline" onClick={handlePrint} disabled={!filtered.length} className="whitespace-nowrap">
            🖨️ Print
          </Button>
        }
      />
      <FormModal open={modal} title={editId ? "Edit Customer" : "Add Customer"} onClose={() => setModal(false)} onSubmit={handleSave} loading={saving} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Full Name" id="name" value={form.name} onChange={set("name")} required placeholder="e.g. Ramesh Kumar" />
          <FormField label="Phone" id="phone" value={form.phone} onChange={set("phone")} placeholder="e.g. 9876543210" />
          <FormField label="Email" id="email" type="email" value={form.email} onChange={set("email")} placeholder="e.g. ramesh@email.com" />
          <FormField label="GST Number" id="gstNumber" value={form.gstNumber} onChange={set("gstNumber")} placeholder="e.g. 29AABCU9603R1ZV" />
          <FormField label="Opening Balance (₹)" id="openingBalance" type="number" value={form.openingBalance} onChange={set("openingBalance")} placeholder="0" />
          <FormField label="Status" id="isActive" type="select" value={form.isActive ? "true" : "false"} onChange={v => setForm(p => ({ ...p, isActive: v === "true" }))} options={[{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }]} />
        </div>
        <FormField label="Address" id="address" type="textarea" value={form.address} onChange={set("address")} placeholder="Full address" rows={2} />
      </FormModal>
    </>
  );
}