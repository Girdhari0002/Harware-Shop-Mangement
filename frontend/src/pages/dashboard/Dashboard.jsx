import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../utils/roles";
import { Link } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { attendanceService } from "../../services/attendance.service";

const statCards = [
  { label: "Today's Sales", value: "₹0", icon: "💰", color: "primary", bg: "primary-light", trend: "+0%" },
  { label: "Today's Purchases", value: "₹0", icon: "🛒", color: "info", bg: "info-light", trend: "+0%" },
  { label: "Today's Profit", value: "₹0", icon: "📈", color: "success", bg: "success-light", trend: "+0%" },
  { label: "Pending Payments", value: "₹0", icon: "⏳", color: "warning", bg: "warning-light", trend: "0 orders" },
];

const quickLinks = [
  { label: "Add Product", icon: "📦", to: "/products", color: "primary" },
  { label: "New Sale", icon: "💰", to: "/sales", color: "success" },
  { label: "New Purchase", icon: "🛒", to: "/purchases", color: "warning" },
  { label: "View Reports", icon: "📊", to: "/reports/sales", color: "info" },
  { label: "Manage Users", icon: "👥", to: "/settings/users", color: "primary", roles: [ROLES.ADMIN] },
  { label: "GST Report", icon: "🧾", to: "/reports/gst", color: "accent" },
];

const colorStyles = {
  primary: { color: "#2F66B3", bg: "#EAF3FF", border: "#D0E3F8" },
  info: { color: "#2563EB", bg: "#DBEAFE", border: "#BFDBFE" },
  success: { color: "#16A34A", bg: "#DCFCE7", border: "#BBF7D0" },
  warning: { color: "#F59E0B", bg: "#FEF3C7", border: "#FDE68A" },
  accent: { color: "#172033", bg: "#FFF4CC", border: "#FDE68A" },
};

const Dashboard = () => {
  const [greeting, setGreeting] = useState("Good day");
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    if (user?.role !== ROLES.ADMIN) { setAttendanceLoading(false); return; }
    attendanceService.today()
      .then((r) => setAttendance(r.data.data || []))
      .catch(() => setAttendance([]))
      .finally(() => setAttendanceLoading(false));
  }, [user?.role]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-1">
          {greeting}, {user?.fullName || "Admin"} 👋
        </h1>
        <p className="text-text-secondary">Here's what's happening at your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card) => {
          const style = colorStyles[card.color];
          return (
            <Card key={card.label} className="relative overflow-hidden hover:shadow-card transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-2">{card.label}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-text-primary tabular-nums">{card.value}</p>
                  <p className="text-xs font-medium mt-1" style={{ color: style.color }}>{card.trend}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: style.bg }}>
                  <span className="text-2xl lg:text-3xl">{card.icon}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.filter(q => !q.roles || (user && q.roles.includes(user.role))).map((link) => {
            const style = colorStyles[link.color];
            return (
              <Link
                key={link.label}
                to={link.to}
                className="group erp-card p-4 flex flex-col items-center gap-3 text-center hover:border-primary hover:shadow-card transition-all duration-200"
              >
                <div className="p-3 rounded-xl" style={{ background: style.bg }}>
                  <span className="text-2xl">{link.icon}</span>
                </div>
                <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card title="📋 Recent Activity" className="h-full">
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-text-secondary mb-1">No recent activity yet</p>
              <p className="text-xs text-text-muted">Start creating sales or purchases</p>
            </div>
          </div>
        </Card>

        {/* Low Stock Alerts */}
        <Card title="⚠️ Low Stock Alerts" className="h-full">
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-success font-medium mb-1">All stock levels are good</p>
              <p className="text-xs text-text-muted">No products need replenishment</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Staff Attendance */}
      {user?.role === ROLES.ADMIN && (
        <Card
          title="🕘 Today's Staff Attendance"
          subtitle="Marked via the gate-pass scanner on the public landing page"
          action={<Link to="/attendance"><Button variant="ghost" size="sm">View All →</Button></Link>}
        >
          {attendanceLoading ? (
            <p className="text-text-secondary text-center py-6">Loading...</p>
          ) : attendance.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🕘</div>
              <p className="text-text-secondary mb-1">No staff have checked in today yet</p>
              <p className="text-xs text-text-muted">Records appear as staff scan their gate pass</p>
            </div>
          ) : (
            <div className="space-y-2">
              {attendance.map((a) => (
                <div key={a._id} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{a.userName}</p>
                    <p className="text-xs text-text-muted capitalize">{a.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-secondary">
                      In: {new Date(a.checkInAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      {a.checkOutAt && <> &middot; Out: {new Date(a.checkOutAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</>}
                    </p>
                    <span className={`erp-badge ${a.status === "checked-out" ? "erp-badge-info" : "erp-badge-success"}`}>
                      {a.status === "checked-out" ? "Checked Out" : "Present"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Dashboard;