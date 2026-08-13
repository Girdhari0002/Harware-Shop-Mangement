import { useState } from "react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";

const SummaryCard = ({ label, value, color, icon }) => {
  const styles = {
    primary: { color: "#2F66B3", bg: "#EAF3FF", border: "#D0E3F8" },
    success: { color: "#16A34A", bg: "#DCFCE7", border: "#BBF7D0" },
    warning: { color: "#F59E0B", bg: "#FEF3C7", border: "#FDE68A" },
    danger: { color: "#DC2626", bg: "#FEE2E2", border: "#FECACA" },
    info: { color: "#2563EB", bg: "#DBEAFE", border: "#BFDBFE" },
  };
  const style = styles[color] || styles.primary;
  const valueColor = value >= 0 ? "#16A34A" : "#DC2626";
  return (
    <Card className="relative overflow-hidden" style={{ borderColor: style.border }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary mb-1">{label}</p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: valueColor }}>₹{value.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-3 rounded-xl" style={{ background: style.bg }}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </Card>
  );
};

export default function ProfitReport() {
  const today = new Date().toISOString().split("T")[0];
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const [sr, pr, er] = await Promise.all([api.get("/sales"), api.get("/purchases"), api.get("/expenses")]);
      const filterDate = (arr) => (arr || []).filter(r => { const d = new Date(r.createdAt || r.date).toISOString().split("T")[0]; return d >= from && d <= to; });
      setSales(filterDate(sr.data.data)); setPurchases(filterDate(pr.data.data)); setExpenses(filterDate(er.data.data)); setSearched(true);
    } catch { } finally { setLoading(false); }
  };

  const totalSales = sales.reduce((s, r) => s + (r.netAmount || 0), 0);
  const totalPurchases = purchases.reduce((s, r) => s + (r.netAmount || 0), 0);
  const totalExpenses = expenses.reduce((s, r) => s + (r.amount || 0), 0);
  const grossProfit = totalSales - totalPurchases;
  const netProfit = grossProfit - totalExpenses;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">💹 Profit Report</h1>
        <p className="text-text-secondary">Profit & loss summary for a date range</p>
      </div>

      <Card subtitle="Select a date range to generate the report">
        <div className="flex flex-wrap gap-4 items-end mb-6">
          <Input label="From Date" type="date" value={from} onChange={e => setFrom(e.target.value)} className="w-full md:w-48" />
          <Input label="To Date" type="date" value={to} onChange={e => setTo(e.target.value)} className="w-full md:w-48" />
          <Button variant="primary" onClick={fetchReport} disabled={loading} className="h-10">
            {loading ? "Loading..." : "Generate Report"}
          </Button>
        </div>

        {searched && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <SummaryCard label="Total Sales" value={totalSales} color="success" icon="💰" />
            <SummaryCard label="Total Purchases" value={totalPurchases} color="warning" icon="🛒" />
            <SummaryCard label="Total Expenses" value={totalExpenses} color="danger" icon="📤" />
            <SummaryCard label="Gross Profit" value={grossProfit} color={grossProfit >= 0 ? "success" : "danger"} icon="📈" />
            <SummaryCard label="Net Profit" value={netProfit} color={netProfit >= 0 ? "success" : "danger"} icon="💹" />
          </div>
        )}

        {!searched && (
          <div className="text-center py-12">
            <div className="text-6xl mb-3">💹</div>
            <p className="text-lg font-medium text-text-secondary mb-2">Select a date range and click Generate Report</p>
            <p className="text-text-muted">See your profit, losses, and expenses summary</p>
          </div>
        )}
      </Card>
    </div>
  );
}