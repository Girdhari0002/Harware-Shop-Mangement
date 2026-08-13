import { useEffect, useState } from "react";
import { attendanceService } from "../../services/attendance.service";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import AttendanceScanner from "./AttendanceScanner";

const StatusBadge = ({ status }) => (
  <span className={`erp-badge ${status === "checked-out" ? "erp-badge-info" : "erp-badge-success"}`}>
    {status === "checked-out" ? "Checked Out" : "Present"}
  </span>
);

const formatTime = (v) => (v ? new Date(v).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—");

export default function AttendanceList() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async (d) => {
    setLoading(true);
    try {
      const r = await attendanceService.list({ date: d });
      setData(r.data.data || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(date); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const columns = [
    { key: "userName", label: "Staff" },
    { key: "role", label: "Role", render: (v) => <span className="capitalize">{v}</span> },
    { key: "date", label: "Date" },
    { key: "checkInAt", label: "Check In", render: formatTime },
    { key: "checkOutAt", label: "Check Out", render: formatTime },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">🕘 Staff Attendance</h1>
        <p className="text-text-secondary">Scan a gate pass to mark attendance, and review daily check-in / check-out records</p>
      </div>

      <AttendanceScanner onMarked={() => { if (date === today) load(date); }} />

      <Card subtitle="Pick a date to view attendance for that day">
        <div className="flex flex-wrap gap-4 items-end">
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full md:w-48" />
          <Button variant="primary" onClick={() => load(date)} disabled={loading} className="h-10">
            {loading ? "Loading..." : "Load"}
          </Button>
          {date !== today && (
            <Button variant="outline" onClick={() => { setDate(today); load(today); }} className="h-10">
              Today
            </Button>
          )}
        </div>
        {!loading && (
          <div className="mt-4 p-4 rounded-lg bg-primary-light border border-primary/30">
            <span className="font-semibold text-primary">{data.length} staff member{data.length === 1 ? "" : "s"} marked on {date}</span>
          </div>
        )}
      </Card>

      <Table
        columns={columns}
        rows={data}
        emptyMessage={loading ? "⏳ Loading..." : "📭 No attendance records for this date"}
      />
    </div>
  );
}
