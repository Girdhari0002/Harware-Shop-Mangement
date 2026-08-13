import { useState } from "react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";
import Table from "../../components/common/Table";
import { downloadCsv, printReport } from "../../utils/reportExport";

const SummaryCard = ({ label, value, color, icon }) => {
  const styles = {
    primary: { color: "#2F66B3", bg: "#EAF3FF", border: "#D0E3F8" },
    success: { color: "#16A34A", bg: "#DCFCE7", border: "#BBF7D0" },
    warning: { color: "#F59E0B", bg: "#FEF3C7", border: "#FDE68A" },
    danger: { color: "#DC2626", bg: "#FEE2E2", border: "#FECACA" },
    info: { color: "#2563EB", bg: "#DBEAFE", border: "#BFDBFE" },
  };
  const style = styles[color] || styles.primary;
  return (
    <Card className="relative overflow-hidden" style={{ borderColor: style.border }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary mb-1">{label}</p>
          <p className="text-2xl font-bold tabular-nums text-text-primary">₹{value.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-3 rounded-xl" style={{ background: style.bg }}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </Card>
  );
};

const months = ["01","02","03","04","05","06","07","08","09","10","11","12"].map((m, i) => ({ value: m, label: new Date(2000, i, 1).toLocaleString("en-IN", { month: "long" }) }));
const years = ["2023","2024","2025","2026"].map(y => ({ value: y, label: y }));

export default function GstReport() {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const [sr, pr] = await Promise.all([api.get("/sales"), api.get("/purchases")]);
      const filter = (arr) => (arr || []).filter(r => { const d = new Date(r.createdAt); return String(d.getMonth() + 1).padStart(2, "0") === month && String(d.getFullYear()) === year; });
      setSales(filter(sr.data.data)); setPurchases(filter(pr.data.data)); setSearched(true);
    } catch { } finally { setLoading(false); }
  };

  const salesTotal = sales.reduce((s, r) => s + (r.netAmount || 0), 0);
  const purchasesTotal = purchases.reduce((s, r) => s + (r.netAmount || 0), 0);
  const netTotal = salesTotal - purchasesTotal;

  const salesColumns = [
    { key: "invoiceNo", label: "Invoice", render: v => <span className="font-mono text-primary">{v}</span> },
    { key: "customerName", label: "Customer" },
    { key: "netAmount", label: "Amount", render: v => <span className="font-semibold text-success">₹{Number(v).toLocaleString("en-IN")}</span> },
    { key: "createdAt", label: "Date", render: v => new Date(v).toLocaleDateString("en-IN") },
  ];

  const purchaseColumns = [
    { key: "billNo", label: "Bill No", render: v => <span className="font-mono text-warning">{v || "—"}</span> },
    { key: "supplierName", label: "Supplier" },
    { key: "netAmount", label: "Amount", render: v => <span className="font-semibold text-warning">₹{Number(v).toLocaleString("en-IN")}</span> },
    { key: "createdAt", label: "Date", render: v => new Date(v).toLocaleDateString("en-IN") },
  ];

  const salesExportColumns = [
    { label: "Invoice", value: (r) => r.invoiceNo },
    { label: "Customer", value: (r) => r.customerName },
    { label: "Amount", value: (r) => r.netAmount },
    { label: "Date", value: (r) => new Date(r.createdAt).toLocaleDateString("en-IN") },
  ];
  const purchaseExportColumns = [
    { label: "Bill No", value: (r) => r.billNo || "" },
    { label: "Supplier", value: (r) => r.supplierName },
    { label: "Amount", value: (r) => r.netAmount },
    { label: "Date", value: (r) => new Date(r.createdAt).toLocaleDateString("en-IN") },
  ];
  const periodLabel = `${months.find(m => m.value === month)?.label} ${year}`;

  const handleExport = () => downloadCsv(`gst-report-${year}-${month}.csv`, [
    { title: `Sales — ${periodLabel}`, columns: salesExportColumns, rows: sales },
    { title: `Purchases — ${periodLabel}`, columns: purchaseExportColumns, rows: purchases },
  ]);
  const handlePrint = () => printReport({
    title: "GST Report",
    subtitle: `${periodLabel} · Sales ₹${salesTotal.toLocaleString("en-IN")} · Purchases ₹${purchasesTotal.toLocaleString("en-IN")} · Net ₹${netTotal.toLocaleString("en-IN")}`,
    sections: [
      { heading: `Sales (${sales.length})`, columns: salesExportColumns, rows: sales, emptyMessage: "No sales this month" },
      { heading: `Purchases (${purchases.length})`, columns: purchaseExportColumns, rows: purchases, emptyMessage: "No purchases this month" },
    ],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">🧾 GST Report</h1>
        <p className="text-text-secondary">Monthly sales and purchase summary for GST filing</p>
      </div>

      <Card subtitle="Select a month and year to generate the report">
        <div className="flex flex-wrap gap-4 items-end mb-6">
          <Select label="Month" id="month" value={month} onChange={e => setMonth(e.target.value)} options={months} className="w-full md:w-48" />
          <Select label="Year" id="year" value={year} onChange={e => setYear(e.target.value)} options={years} className="w-full md:w-48" />
          <Button variant="primary" onClick={fetchReport} disabled={loading} className="h-10">
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>

        {searched && (
          <div className="flex justify-end gap-3 mb-4">
            <Button variant="outline" onClick={handleExport} disabled={!sales.length && !purchases.length} className="whitespace-nowrap">
              ⬇️ Export CSV
            </Button>
            <Button variant="outline" onClick={handlePrint} disabled={!sales.length && !purchases.length} className="whitespace-nowrap">
              🖨️ Print
            </Button>
          </div>
        )}

        {searched && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <SummaryCard label="Total Sales" value={salesTotal} color="success" icon="💰" />
            <SummaryCard label="Total Purchases" value={purchasesTotal} color="warning" icon="🛒" />
            <SummaryCard label="Net (Sales - Purchase)" value={netTotal} color={netTotal >= 0 ? "success" : "danger"} icon="📊" />
          </div>
        )}

        {searched && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Sales ({sales.length})</h3>
              <Table
                columns={salesColumns}
                rows={sales}
                emptyMessage="No sales this month"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Purchases ({purchases.length})</h3>
              <Table
                columns={purchaseColumns}
                rows={purchases}
                emptyMessage="No purchases this month"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}