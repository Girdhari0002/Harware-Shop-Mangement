import { useState } from "react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";

const StatusBadge = ({ status }) => {
  const tones = {
    paid: "success",
    pending: "warning",
    partial: "info",
    cancelled: "danger",
  };
  const tone = tones[status?.toLowerCase()] || "info";
  return <span className={`erp-badge erp-badge-${tone}`}>{status}</span>;
};

export default function PurchaseReport() {
  const today = new Date().toISOString().split("T")[0];
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const r = await api.get("/purchases");
      const all = r.data.data || [];
      setData(all.filter(s => {
        const d = new Date(s.createdAt).toISOString().split("T")[0];
        return d >= from && d <= to;
      }));
      setSearched(true);
    } catch { } finally { setLoading(false); }
  };

  const total = data.reduce((s, r) => s + (r.netAmount || 0), 0);

  const columns = [
    { key: "billNo", label: "Bill No", render: v => <span className="font-mono text-warning">{v || "—"}</span> },
    { key: "supplierName", label: "Supplier" },
    { key: "netAmount", label: "Amount", render: v => <span className="font-semibold text-warning">₹{Number(v).toLocaleString("en-IN")}</span> },
    { key: "paymentStatus", label: "Status", render: StatusBadge },
    { key: "paymentMethod", label: "Method", render: v => v?.toUpperCase() },
    { key: "createdAt", label: "Date", render: v => new Date(v).toLocaleDateString("en-IN") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">🛒 Purchase Report</h1>
        <p className="text-text-secondary">View purchases by date range</p>
      </div>

      <Card subtitle="Select a date range to generate the report">
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <Input label="From Date" type="date" value={from} onChange={e => setFrom(e.target.value)} className="w-full md:w-48" />
          <Input label="To Date" type="date" value={to} onChange={e => setTo(e.target.value)} className="w-full md:w-48" />
          <Button variant="primary" onClick={fetchReport} disabled={loading} className="h-10">
            Generate Report
          </Button>
        </div>

        {searched && (
          <div className="mb-4 p-4 rounded-lg bg-warning-light border border-warning/30">
            <span className="font-semibold text-warning">Total Purchases: ₹{total.toLocaleString("en-IN")} ({data.length} records)</span>
          </div>
        )}

        <Table
          columns={columns}
          rows={data}
          emptyMessage={!searched ? "📅 Select a date range and click Generate Report" : "📭 No purchases in selected date range"}
        />
      </Card>
    </div>
  );
}