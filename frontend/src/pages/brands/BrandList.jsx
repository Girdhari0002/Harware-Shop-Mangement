import { useEffect, useState } from "react";
import api from "../../services/api";
import CrudPage from "../../components/common/CrudPage";
import FormModal from "../../components/common/FormModal";
import FormField from "../../components/common/FormField";

const empty = { name: "", description: "", isActive: true };

const ActiveBadge = ({ active }) => (
  <span className={`erp-badge ${active ? "erp-badge-success" : "erp-badge-danger"}`}>
    {active ? "Active" : "Inactive"}
  </span>
);

export default function BrandList() {
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
    try { const r = await api.get("/brands"); setData(r.data.data || []); }
    catch { showToast("Failed to load", "danger"); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = data.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = (row) => { setForm({ name: row.name, description: row.description || "", isActive: row.isActive }); setEditId(row._id); setModal(true); };

  const handleSave = async () => {
    if (!form.name.trim()) return showToast("Name is required", "warning");
    setSaving(true);
    try {
      editId ? await api.put(`/brands/${editId}`, form) : await api.post("/brands", form);
      showToast(editId ? "Brand updated!" : "Brand created!", "success"); setModal(false); load();
    } catch (e) { showToast(e?.response?.data?.message || "Error saving", "danger"); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => { await api.delete(`/brands/${id}`); showToast("Deleted!", "success"); load(); };

  const columns = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description", render: v => v || "—" },
    { key: "isActive", label: "Status", render: (v) => <ActiveBadge active={v} /> },
    { key: "createdAt", label: "Created", render: v => new Date(v).toLocaleDateString("en-IN") },
  ];

  return (
    <>
      {toast.message && <div className="fixed top-5 right-5 z-50"><div className={`erp-card border px-4 py-3 text-sm shadow-[0_10px_40px_rgba(23,32,51,0.15)] animate-in slide-in-from-top-2 fade-in-0 duration-200 ${toast.tone === "success" ? "border-success/30 bg-success-light text-success" : toast.tone === "danger" ? "border-danger/30 bg-danger-light text-danger" : toast.tone === "warning" ? "border-warning/30 bg-warning-light text-warning" : "border-primary/30 bg-primary-light text-primary"}`}>{toast.message}</div></div>}
      <CrudPage title="Brands" subtitle="Manage product brands" columns={columns} data={filtered} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} searchValue={search} onSearchChange={setSearch} addLabel="Add Brand" />
      <FormModal open={modal} title={editId ? "Edit Brand" : "Add Brand"} onClose={() => setModal(false)} onSubmit={handleSave} loading={saving}>
        <FormField label="Name" id="name" value={form.name} onChange={set("name")} required placeholder="e.g. Asian Paints" />
        <FormField label="Description" id="description" type="textarea" value={form.description} onChange={set("description")} placeholder="Optional description" />
        <FormField label="Status" id="isActive" type="select" value={form.isActive ? "true" : "false"} onChange={v => setForm(p => ({ ...p, isActive: v === "true" }))} options={[{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }]} />
      </FormModal>
    </>
  );
}