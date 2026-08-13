import { useEffect, useState } from "react";
import api from "../../services/api";
import CrudPage from "../../components/common/CrudPage";
import FormModal from "../../components/common/FormModal";
import FormField from "../../components/common/FormField";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

const empty = { name: "", sku: "", description: "", category: "", brand: "", unit: "pcs", buyPrice: "", sellPrice: "", quantity: "", minStock: "", isActive: true };
const units = ["pcs","kg","m","sqft","sheet","box","ltr"].map(u => ({ value: u, label: u }));

const ActiveBadge = ({ active }) => (
  <span className={`erp-badge ${active ? "erp-badge-success" : "erp-badge-danger"}`}>
    {active ? "Active" : "Inactive"}
  </span>
);

export default function ProductList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [cats, setCats] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ message: "", tone: "info" });

  const showToast = (message, tone = "info") => {
    setToast({ message, tone });
    setTimeout(() => setToast({ message: "", tone: "info" }), 3000);
  };

  const set = (key) => (v) => setForm(p => ({ ...p, [key]: v }));

  const load = async () => {
    setLoading(true);
    try {
      const [pr, cr, br] = await Promise.all([api.get("/products"), api.get("/categories"), api.get("/brands")]);
      setData(pr.data.data || []);
      setCats((cr.data.data || []).map(c => ({ value: c._id, label: c.name })));
      setBrands((br.data.data || []).map(b => ({ value: b._id, label: b.name })));
    } catch { showToast("Failed to load data", "danger"); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = data.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()) || d.sku?.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = (row) => {
    setForm({ name: row.name, sku: row.sku || "", description: row.description || "", category: row.category?._id || row.category || "", brand: row.brand?._id || row.brand || "", unit: row.unit || "pcs", buyPrice: row.buyPrice || "", sellPrice: row.sellPrice || "", quantity: row.quantity || "", minStock: row.minStock || "", isActive: row.isActive });
    setEditId(row._id); setModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return showToast("Name is required", "warning");
    setSaving(true);
    const payload = {
      ...form,
      category: form.category || null,
      brand: form.brand || null,
    };
    try {
      editId ? await api.put(`/products/${editId}`, payload) : await api.post("/products", payload);
      showToast(editId ? "Product updated!" : "Product created!", "success");
      setModal(false); load();
    } catch (e) { showToast(e?.response?.data?.message || "Error saving", "danger"); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    showToast("Deleted!", "success");
    load();
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "sku", label: "SKU", render: v => v || "—" },
    { key: "category", label: "Category", render: (v) => v?.name || "—" },
    { key: "sellPrice", label: "Price", render: v => `₹${Number(v).toLocaleString("en-IN")}` },
    { key: "quantity", label: "Stock", render: (v, row) => `${v} ${row.unit}` },
    { key: "isActive", label: "Status", render: (v) => <ActiveBadge active={v} /> },
  ];

  return (
    <>
      {toast.message && <div className="fixed top-5 right-5 z-50"><div className={`erp-card border px-4 py-3 text-sm shadow-[0_10px_40px_rgba(23,32,51,0.15)] animate-in slide-in-from-top-2 fade-in-0 duration-200 ${toast.tone === "success" ? "border-success/30 bg-success-light text-success" : toast.tone === "danger" ? "border-danger/30 bg-danger-light text-danger" : toast.tone === "warning" ? "border-warning/30 bg-warning-light text-warning" : "border-primary/30 bg-primary-light text-primary"}`}>{toast.message}</div></div>}
      <CrudPage
        title="Products"
        subtitle="Manage your inventory items"
        columns={columns}
        data={filtered}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Add Product"
      />
      <FormModal open={modal} title={editId ? "Edit Product" : "Add Product"} onClose={() => setModal(false)} onSubmit={handleSave} loading={saving} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Product Name" id="name" value={form.name} onChange={set("name")} required placeholder="e.g. Plywood 18mm" />
          <FormField label="SKU" id="sku" value={form.sku} onChange={set("sku")} placeholder="e.g. PLY-18MM" />
          <FormField label="Category" id="category" type="select" value={form.category} onChange={set("category")} options={cats} />
          <FormField label="Brand" id="brand" type="select" value={form.brand} onChange={set("brand")} options={brands} />
          <FormField label="Buy Price (₹)" id="buyPrice" type="number" value={form.buyPrice} onChange={set("buyPrice")} placeholder="0" />
          <FormField label="Sell Price (₹)" id="sellPrice" type="number" value={form.sellPrice} onChange={set("sellPrice")} placeholder="0" />
          <FormField label="Quantity" id="quantity" type="number" value={form.quantity} onChange={set("quantity")} placeholder="0" />
          <FormField label="Unit" id="unit" type="select" value={form.unit} onChange={set("unit")} options={units} />
          <FormField label="Min Stock Alert" id="minStock" type="number" value={form.minStock} onChange={set("minStock")} placeholder="0" />
          <FormField label="Status" id="isActive" type="select" value={form.isActive ? "true" : "false"} onChange={v => setForm(p => ({ ...p, isActive: v === "true" }))} options={[{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }]} />
        </div>
        <FormField label="Description" id="description" type="textarea" value={form.description} onChange={set("description")} placeholder="Optional product description" />
      </FormModal>
    </>
  );
}