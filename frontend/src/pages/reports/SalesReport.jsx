import { useState } from "react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import { downloadCsv, printReport } from "../../utils/reportExport";

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

export default function SalesReport() {
  const today = new Date().toISOString().split("T")[0];
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const r = await api.get("/sales");
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
    { key: "invoiceNo", label: "Invoice", render: v => <span className="font-mono text-primary">{v}</span> },
    { key: "customerName", label: "Customer" },
    { key: "netAmount", label: "Amount", render: v => <span className="font-semibold text-success">₹{Number(v).toLocaleString("en-IN")}</span> },
    { key: "paymentStatus", label: "Status", render: StatusBadge },
    { key: "paymentMethod", label: "Method", render: v => v?.toUpperCase() },
    { key: "createdAt", label: "Date", render: v => new Date(v).toLocaleDateString("en-IN") },
  ];

  const exportColumns = [
    { label: "Invoice", value: (r) => r.invoiceNo },
    { label: "Customer", value: (r) => r.customerName },
    { label: "Amount", value: (r) => r.netAmount },
    { label: "Status", value: (r) => r.paymentStatus },
    { label: "Method", value: (r) => r.paymentMethod?.toUpperCase() },
    { label: "Date", value: (r) => new Date(r.createdAt).toLocaleDateString("en-IN") },
  ];

  const handleExport = () => downloadCsv(`sales-report-${from}-to-${to}.csv`, [{ columns: exportColumns, rows: data }]);
  const handlePrint = () => printReport({
    title: "Sales Report",
    subtitle: `${from} to ${to} · Total ₹${total.toLocaleString("en-IN")} · ${data.length} record(s)`,
    sections: [{ columns: exportColumns, rows: data, emptyMessage: "No sales in selected date range" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">📈 Sales Report</h1>
        <p className="text-text-secondary">View sales by date range</p>
      </div>

      <Card subtitle="Select a date range to generate the report">
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <Input label="From Date" type="date" value={from} onChange={e => setFrom(e.target.value)} className="w-full md:w-48" />
          <Input label="To Date" type="date" value={to} onChange={e => setTo(e.target.value)} className="w-full md:w-48" />
          <Button variant="primary" onClick={fetchReport} disabled={loading} className="h-10">
            {loading ? "Generating..." : "Generate Report"}
          </Button>
        </div>

        {searched && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 p-4 rounded-lg bg-success-light border border-success/30">
            <span className="font-semibold text-success">Total Sales: ₹{total.toLocaleString("en-IN")} ({data.length} records)</span>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExport} disabled={!data.length} className="whitespace-nowrap">
                ⬇️ Export CSV
              </Button>
              <Button variant="outline" onClick={handlePrint} disabled={!data.length} className="whitespace-nowrap">
                🖨️ Print
              </Button>
            </div>
          </div>
        )}

        <Table
          columns={columns}
          rows={data}
          emptyMessage={!searched ? "📅 Select a date range and click Generate Report" : "📭 No sales in selected date range"}
        />
      </Card>
    </div>
  );
}