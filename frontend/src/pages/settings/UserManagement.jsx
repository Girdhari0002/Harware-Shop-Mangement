import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { settingsService } from "../../services/settings.service";
import CrudPage from "../../components/common/CrudPage";
import FormModal from "../../components/common/FormModal";
import FormField from "../../components/common/FormField";
import Modal from "../../components/common/Modal";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const empty = { fullName: "", email: "", password: "", phone: "", address: "", role: "staff" };
const roleOpts = [{ value: "admin", label: "Admin" }, { value: "staff", label: "Staff" }];

const RoleBadge = ({ role }) => (
  <span className={`erp-badge ${role === "admin" ? "erp-badge-info" : "erp-badge-primary"}`}>
    {role === "admin" ? "🛡️ Admin" : "👤 Staff"}
  </span>
);

const ActiveBadge = ({ active }) => (
  <span className={`erp-badge ${active !== false ? "erp-badge-success" : "erp-badge-danger"}`}>
    {active !== false ? "Active" : "Inactive"}
  </span>
);

const printGatePass = (pass) => {
  const { user, employeeCode, barcodeSvg, qrSvg } = pass;
  const win = window.open("", "_blank", "width=420,height=600");
  if (!win) return;
  win.document.write(`
    <html>
      <head>
        <title>Gate Pass - ${user.fullName}</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 24px; }
          .badge { border: 2px solid #2F66B3; border-radius: 12px; padding: 20px; max-width: 320px; margin: 0 auto; }
          h2 { margin: 0 0 4px; color: #2F66B3; }
          .role { text-transform: uppercase; font-size: 12px; letter-spacing: 1px; color: #666; margin-bottom: 16px; }
          .code { font-family: monospace; font-size: 14px; margin-top: 8px; letter-spacing: 2px; }
          .codes { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 12px; }
          .codes svg { width: 160px; height: 160px; }
          .barcode svg { width: 260px; height: auto; margin-top: 12px; }
        </style>
      </head>
      <body>
        <div class="badge">
          <h2>${user.fullName}</h2>
          <div class="role">${user.role} &middot; Gate Pass</div>
          <div class="codes">${qrSvg}</div>
          <div class="barcode">${barcodeSvg}</div>
          <div class="code">${employeeCode}</div>
        </div>
        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `);
  win.document.close();
};

const downloadCsvTemplate = () => {
  const csv = "Full Name,Email,Password,Role\r\nRamesh Kumar,ramesh@shop.com,Passw0rd!,staff\r\n";
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "user-import-template.csv";
  a.click();
  URL.revokeObjectURL(url);
};

const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const printUserList = (users) => {
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;
  const rows = users.map((u) => `
    <tr>
      <td>${escapeHtml(u.fullName)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td>${escapeHtml(u.employeeCode || "—")}</td>
      <td>${escapeHtml(u.role)}</td>
      <td>${u.isActive !== false ? "Active" : "Inactive"}</td>
      <td>${new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
    </tr>`).join("");
  win.document.write(`
    <html>
      <head>
        <title>User List</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #172033; }
          h2 { color: #2F66B3; margin-bottom: 4px; }
          p { color: #666; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; font-size: 13px; }
          th { background: #f2f5fa; }
        </style>
      </head>
      <body>
        <h2>User List</h2>
        <p>Generated ${new Date().toLocaleString("en-IN")} &middot; ${users.length} user(s)</p>
        <table>
          <thead><tr><th>Full Name</th><th>Email</th><th>Gate Pass Code</th><th>Role</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `);
  win.document.close();
};

export default function UserManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", tone: "info" });

  const [gatePassModal, setGatePassModal] = useState(false);
  const [gatePass, setGatePass] = useState(null);
  const [gatePassLoading, setGatePassLoading] = useState(false);

  const [verifyCode, setVerifyCode] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState("idle"); // idle | loading | found | not-found

  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = (message, tone = "info") => {
    setToast({ message, tone });
    setTimeout(() => setToast({ message: "", tone: "info" }), 3000);
  };

  const set = (key) => (v) => setForm(p => ({ ...p, [key]: v }));

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/settings");
      setData(r.data.data || []);
    } catch { showToast("Failed to load", "danger"); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = (row) => { setForm({ fullName: row.fullName, email: row.email, password: "", phone: row.phone || "", address: row.address || "", role: row.role }); setEditId(row._id); setModal(true); };

  const handleSave = async () => {
    if (!form.fullName.trim() || !form.email.trim()) return showToast("Full name and email required", "warning");
    if (!editId && !form.password.trim()) return showToast("Password required for new user", "warning");
    setSaving(true);
    try {
      const payload = editId
        ? { fullName: form.fullName, phone: form.phone, address: form.address, role: form.role }
        : form;
      editId ? await api.put(`/settings/${editId}`, payload) : await api.post("/settings", payload);
      showToast(editId ? "User updated!" : "User created! A gate pass barcode has been generated.", "success");
      setModal(false); load();
    } catch (e) { showToast(e?.response?.data?.message || "Error saving", "danger"); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/settings/${id}`);
      showToast("User deleted!", "success");
      load();
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to delete user", "danger");
    }
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
      const res = await settingsService.importUsers(file);
      const { created, skipped } = res.data.data;
      const tone = created.length && !skipped.length ? "success" : created.length ? "warning" : "danger";
      showToast(`Imported ${created.length} user(s)${skipped.length ? `, skipped ${skipped.length} (${skipped[0].reason}${skipped.length > 1 ? ", ..." : ""})` : ""}`, tone);
      load();
    } catch (e) {
      showToast(e?.response?.data?.message || "Import failed", "danger");
    } finally {
      setImporting(false);
    }
  };

  const openGatePass = async (row) => {
    setGatePassModal(true);
    setGatePass(null);
    setGatePassLoading(true);
    try {
      const res = await settingsService.gatePass(row._id);
      setGatePass(res.data.data);
    } catch {
      showToast("Failed to load gate pass", "danger");
      setGatePassModal(false);
    } finally {
      setGatePassLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyCode.trim()) return;
    setVerifyStatus("loading");
    setVerifyResult(null);
    try {
      const res = await settingsService.verifyGatePass(verifyCode.trim());
      setVerifyResult(res.data.data);
      setVerifyStatus("found");
    } catch {
      setVerifyStatus("not-found");
    }
  };

  const columns = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "employeeCode", label: "Gate Pass Code", render: (v) => <span className="font-mono text-xs text-text-secondary">{v || "—"}</span> },
    { key: "role", label: "Role", render: (v) => <RoleBadge role={v} /> },
    { key: "isActive", label: "Status", render: (v) => <ActiveBadge active={v} /> },
    { key: "createdAt", label: "Created", render: v => new Date(v).toLocaleDateString("en-IN") },
  ];

  return (
    <div className="space-y-6">
      {toast.message && <div className="fixed top-5 right-5 z-50"><div className={`erp-card border px-4 py-3 text-sm shadow-[0_10px_40px_rgba(23,32,51,0.15)] animate-in slide-in-from-top-2 fade-in-0 duration-200 ${toast.tone === "success" ? "border-success/30 bg-success-light text-success" : toast.tone === "danger" ? "border-danger/30 bg-danger-light text-danger" : toast.tone === "warning" ? "border-warning/30 bg-warning-light text-warning" : "border-primary/30 bg-primary-light text-primary"}`}>{toast.message}</div></div>}

      <Card title="🎫 Verify Gate Pass" subtitle="Scan or type a staff member's gate pass code to verify their identity at the gate.">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <Input
              label="Gate Pass Code"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="e.g. 900000000001"
              autoComplete="off"
            />
          </div>
          <Button variant="primary" onClick={handleVerify} disabled={verifyStatus === "loading"} className="h-10 whitespace-nowrap">
            {verifyStatus === "loading" ? "Verifying..." : "Verify"}
          </Button>
        </div>

        {verifyStatus === "found" && verifyResult && (
          <div className="mt-4 p-4 rounded-lg bg-success-light border border-success/30 flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="font-semibold text-success">✅ Verified — {verifyResult.fullName}</p>
              <p className="text-sm text-text-secondary">{verifyResult.email} &middot; {verifyResult.role}</p>
            </div>
            <ActiveBadge active={verifyResult.isActive} />
          </div>
        )}
        {verifyStatus === "not-found" && (
          <div className="mt-4 p-4 rounded-lg bg-danger-light border border-danger/30">
            <p className="font-semibold text-danger">❌ No staff member found for this code</p>
          </div>
        )}
      </Card>

      <CrudPage
        title="User Management"
        subtitle="Manage admin and staff accounts"
        columns={columns}
        data={data}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        canDelete={(row) => !row.isProtected}
        addLabel="Add User"
        extraActions={(row) => (
          <Button variant="ghost" size="sm" onClick={() => openGatePass(row)} className="h-8 px-2 py-0">
            🎫 Gate Pass
          </Button>
        )}
        headerExtra={
          <>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImportFile} />
            <Button variant="outline" onClick={handleImportClick} disabled={importing} className="whitespace-nowrap" title="Import users from a CSV file (Excel: File > Save As > CSV)">
              {importing ? "Importing..." : "📥 Import Excel"}
            </Button>
            <Button variant="outline" onClick={downloadCsvTemplate} className="whitespace-nowrap" title="Download a CSV template formatted for import">
              ⬇️ Template
            </Button>
            <Button variant="outline" onClick={() => printUserList(data)} disabled={!data.length} className="whitespace-nowrap">
              🖨️ Print List
            </Button>
          </>
        }
      />

      <FormModal open={modal} title={editId ? "Edit User" : "Add User"} onClose={() => setModal(false)} onSubmit={handleSave} loading={saving}>
        <FormField label="Full Name" id="fullName" value={form.fullName} onChange={set("fullName")} required placeholder="e.g. Ramesh Kumar" />
        <FormField label="Email" id="email" type="email" value={form.email} onChange={set("email")} required placeholder="e.g. ramesh@shop.com" />
        {!editId && <FormField label="Password" id="password" type="password" value={form.password} onChange={set("password")} required placeholder="Min 6 characters" />}
        <FormField label="Phone Number" id="phone" value={form.phone} onChange={set("phone")} placeholder="e.g. 9876543210" />
        <FormField label="Address" id="address" type="textarea" value={form.address} onChange={set("address")} placeholder="Full address" rows={2} />
        <FormField label="Role" id="role" type="select" value={form.role} onChange={set("role")} options={roleOpts} />
      </FormModal>

      <Modal open={gatePassModal} title="Staff Gate Pass" onClose={() => setGatePassModal(false)} size="sm">
        {gatePassLoading && <p className="text-text-secondary text-center py-8">Generating badge...</p>}
        {!gatePassLoading && gatePass && (
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-text-primary">{gatePass.user.fullName}</h3>
            <p className="text-sm text-text-secondary uppercase tracking-wide">{gatePass.user.role}</p>
            <div className="flex items-center justify-center [&>svg]:w-40 [&>svg]:h-40" dangerouslySetInnerHTML={{ __html: gatePass.qrSvg }} />
            <div className="flex items-center justify-center [&>svg]:w-64 [&>svg]:h-auto" dangerouslySetInnerHTML={{ __html: gatePass.barcodeSvg }} />
            <p className="font-mono text-sm text-text-secondary">{gatePass.employeeCode}</p>
            <Button variant="primary" className="w-full" onClick={() => printGatePass(gatePass)}>
              🖨️ Print Gate Pass
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
