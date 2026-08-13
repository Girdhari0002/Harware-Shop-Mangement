import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import FileUpload from "../../components/common/FileUpload";
import Toast from "../../components/common/Toast";
import { companyService } from "../../services/company.service";
import useCompany from "../../hooks/useCompany";

const emptyForm = {
  name: "",
  gstNumber: "",
  phone: "",
  email: "",
  state: "",
  pinCode: "",
  address: ""
};

export default function CompanyProfile() {
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const { refresh: refreshCompany } = useCompany() || {};

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await companyService.get();
        const data = res?.data?.data;
        if (!mounted || !data) return;
        setForm({
          name: data.company?.name || "",
          gstNumber: data.company?.gstNumber || "",
          phone: data.company?.phone || "",
          email: data.company?.email || "",
          state: data.state || "",
          pinCode: data.company?.pinCode || "",
          address: data.company?.address || ""
        });
        setLogoPreview(data.company?.logo ? toAbsolute(data.company.logo) : "");
      } catch (err) {
        setToast({ tone: "danger", message: "Could not load company profile." });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const toAbsolute = (logo) => {
    if (!logo) return "";
    if (logo.startsWith("http") || logo.startsWith("blob:")) return logo;
    const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/api\/v1\/?$/, "");
    return `${base}${logo}`;
  };

  const handleChange = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("gstNumber", form.gstNumber);
      fd.append("phone", form.phone);
      fd.append("email", form.email);
      fd.append("state", form.state);
      fd.append("pinCode", form.pinCode);
      fd.append("address", form.address);
      if (logoFile) fd.append("logo", logoFile);

      await companyService.update(fd);
      await refreshCompany?.();
      setLogoFile(null);
      setToast({ tone: "success", message: "Company profile saved!" });
    } catch (err) {
      setToast({ tone: "danger", message: err?.response?.data?.message || "Failed to save company profile." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toast tone={toast?.tone} message={toast?.message} />

      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">🏢 Company Profile</h1>
        <p className="text-text-secondary">Manage your business information</p>
      </div>

      <Card subtitle="Logo shown across the login page, landing page and sidebar">
        <div className="flex items-center gap-4 mb-2">
          {logoPreview ? (
            <img src={logoPreview} alt="Company logo" className="w-16 h-16 rounded-xl object-cover border border-border" />
          ) : (
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold" style={{ background: "linear-gradient(135deg, #2F66B3, #24518F)" }}>
              ⚡
            </div>
          )}
          <div className="flex-1">
            <FileUpload label="Upload company logo" accept="image/*" onChange={handleLogoChange} />
          </div>
        </div>
      </Card>

      <Card subtitle="Update your company details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input label="Company Name" id="companyName" value={form.name} onChange={handleChange("name")} placeholder="e.g. ABC Hardware Store" disabled={loading} />
          <Input label="GST Number" id="gstNumber" value={form.gstNumber} onChange={handleChange("gstNumber")} placeholder="e.g. 29AABCU9603R1ZV" disabled={loading} />
          <Input label="Phone" id="phone" value={form.phone} onChange={handleChange("phone")} placeholder="e.g. 9876543210" disabled={loading} />
          <Input label="Email" id="email" type="email" value={form.email} onChange={handleChange("email")} placeholder="e.g. info@abchardware.com" disabled={loading} />
          <Input label="State" id="state" value={form.state} onChange={handleChange("state")} placeholder="e.g. Karnataka" disabled={loading} />
          <Input label="PIN Code" id="pinCode" value={form.pinCode} onChange={handleChange("pinCode")} placeholder="e.g. 560001" disabled={loading} />
        </div>
        <div className="mb-4">
          <Input label="Address" id="address" type="textarea" value={form.address} onChange={handleChange("address")} placeholder="Full business address" rows={3} disabled={loading} />
        </div>
        <Button variant="primary" onClick={handleSave} disabled={loading || saving}>
          {saving ? "Saving..." : "💾 Save Changes"}
        </Button>
      </Card>
    </div>
  );
}
