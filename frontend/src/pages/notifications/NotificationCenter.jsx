import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const notifications = [
  { icon: "✅", title: "System Ready", msg: "ERP system initialized successfully", time: "Just now", color: "success" },
  { icon: "🔑", title: "Admin Login", msg: "Admin account logged in successfully", time: "A moment ago", color: "primary" },
  { icon: "💾", title: "Database Connected", msg: "MongoDB connection established", time: "On startup", color: "warning" },
];

const colorStyles = {
  primary: { bg: "#EAF3FF", border: "#D0E3F8", color: "#2F66B3" },
  success: { bg: "#DCFCE7", border: "#BBF7D0", color: "#16A34A" },
  warning: { bg: "#FEF3C7", border: "#FDE68A", color: "#F59E0B" },
  info: { bg: "#DBEAFE", border: "#BFDBFE", color: "#2563EB" },
};

export default function NotificationCenter() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">🔔 Notifications</h1>
          <p className="text-text-secondary">System alerts and activity updates</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-light text-primary border border-primary/30">
          {notifications.length} new
        </span>
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => {
          const style = colorStyles[n.color];
          return (
            <Card key={i} className="p-4 flex items-start gap-4" style={{ borderColor: style.border }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: style.bg, border: `1px solid ${style.border}` }}>
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-text-primary text-sm mb-1">{n.title}</div>
                <div className="text-sm text-text-secondary">{n.msg}</div>
              </div>
              <div className="text-xs text-text-muted whitespace-nowrap">{n.time}</div>
            </Card>
          );
        })}
        <Card className="p-8 text-center">
          <div className="text-5xl mb-3">📭</div>
          <div className="text-lg font-semibold text-text-secondary mb-1">No more notifications</div>
          <div className="text-sm text-text-muted">You're all caught up!</div>
        </Card>
      </div>
    </div>
  );
}