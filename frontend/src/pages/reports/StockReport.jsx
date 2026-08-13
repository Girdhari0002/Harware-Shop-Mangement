import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import { downloadCsv, printReport } from "../../utils/reportExport";

const StockBadge = ({ quantity, minStock }) => {
  const isLow = quantity <= minStock;
  return (
    <span className={`erp-badge ${isLow ? "erp-badge-danger" : "erp-badge-success"}`}>
      {isLow ? "⚠️ Low Stock" : "✅ OK"}
    </span>
  );
};

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
          <p className="text-2xl font-bold tabular-nums text-text-primary">{value}</p>
        </div>
        <div className="p-3 rounded-xl" style={{ background: style.bg }}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </Card>
  );
};

export default function StockReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/products").then(r => setData(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()));
  const lowStock = filtered.filter(p => p.quantity <= p.minStock);
  const ok = filtered.filter(p => p.quantity > p.minStock);

  const columns = [
    { key: "name", label: "Product" },
    { key: "sku", label: "SKU", render: v => <span className="font-mono text-text-muted">{v || "—"}</span> },
    { key: "quantity", label: "Quantity", render: (v, row) => (
      <span className={`font-semibold ${v <= row.minStock ? "text-danger" : "text-success"}`}>{v}</span>
    )},
    { key: "unit", label: "Unit" },
    { key: "minStock", label: "Min Stock" },
    { key: "quantity", label: "Status", render: (v, row) => <StockBadge quantity={v} minStock={row.minStock} /> },
  ];

  const exportColumns = [
    { label: "Product", value: (r) => r.name },
    { label: "SKU", value: (r) => r.sku || "" },
    { label: "Quantity", value: (r) => r.quantity },
    { label: "Unit", value: (r) => r.unit },
    { label: "Min Stock", value: (r) => r.minStock },
    { label: "Status", value: (r) => (r.quantity <= r.minStock ? "Low Stock" : "OK") },
  ];

  const handleExport = () => downloadCsv("stock-report.csv", [{ columns: exportColumns, rows: filtered }]);
  const handlePrint = () => printReport({
    title: "Stock Report",
    subtitle: `Generated ${new Date().toLocaleString("en-IN")} · ${filtered.length} product(s)`,
    sections: [{ columns: exportColumns, rows: filtered, emptyMessage: "No products found" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">📊 Stock Report</h1>
        <p className="text-text-secondary">Current inventory stock levels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard label="Total Products" value={data.length} color="primary" icon="📦" />
        <SummaryCard label="Low Stock Items" value={lowStock.length} color="danger" icon="⚠️" />
        <SummaryCard label="OK Items" value={ok.length} color="success" icon="✅" />
      </div>

      <Card subtitle="Search and filter products by stock level">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          <Input placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)} className="w-full md:w-64" />
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport} disabled={!filtered.length} className="whitespace-nowrap">
              ⬇️ Export CSV
            </Button>
            <Button variant="outline" onClick={handlePrint} disabled={!filtered.length} className="whitespace-nowrap">
              🖨️ Print
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          rows={filtered}
          emptyMessage={loading ? "⏳ Loading..." : "📭 No products found"}
        />
      </Card>
    </div>
  );
}