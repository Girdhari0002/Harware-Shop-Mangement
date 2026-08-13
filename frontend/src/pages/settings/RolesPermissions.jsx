import Card from "../../components/common/Card";
import Table from "../../components/common/Table";

const roles = [
  { name: "Admin", color: "info", permissions: ["Login", "View Dashboard", "Manage Products", "Manage Categories", "Manage Brands", "Manage Customers", "Manage Suppliers", "Create Sales", "Create Purchases", "Manage Expenses", "Record Payments", "View All Reports", "Manage Users", "Company Settings"] },
  { name: "Staff", color: "primary", permissions: ["Login", "View Dashboard", "View Products", "View Customers", "View Suppliers", "Create Sales", "View Reports"] },
];

const permissionMatrix = [
  ["Dashboard", "✅", "✅"],
  ["Products CRUD", "✅", "👁️ View Only"],
  ["Categories & Brands", "✅", "👁️ View Only"],
  ["Customers & Suppliers", "✅", "👁️ View Only"],
  ["Sales", "✅", "✅"],
  ["Purchases", "✅", "❌"],
  ["Expenses", "✅", "❌"],
  ["Payments", "✅", "❌"],
  ["Reports", "✅ All", "📈 Basic"],
  ["User Management", "✅", "❌"],
  ["Company Settings", "✅", "❌"],
];

const RoleCard = ({ role }) => {
  const colorStyles = {
    primary: { color: "#2F66B3", bg: "#EAF3FF", border: "#D0E3F8" },
    info: { color: "#2563EB", bg: "#DBEAFE", border: "#BFDBFE" },
  };
  const style = colorStyles[role.color] || colorStyles.primary;
  const icon = role.name === "Admin" ? "🛡️" : "👤";

  return (
    <Card className="relative overflow-hidden h-full" style={{ borderColor: style.border }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: style.bg }}>
          {icon}
        </div>
        <div>
          <div className="font-bold text-lg" style={{ color: style.color }}>{role.name}</div>
          <div className="text-sm text-text-muted">{role.permissions.length} permissions</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {role.permissions.map(p => (
          <span key={p} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
            ✓ {p}
          </span>
        ))}
      </div>
    </Card>
  );
};

const MatrixTable = () => {
  const columns = [
    { key: "feature", label: "Feature" },
    { key: "admin", label: "Admin" },
    { key: "staff", label: "Staff" },
  ];

  const rows = permissionMatrix.map(([feat, admin, staff]) => ({
    id: feat,
    feature: feat,
    admin: <span className={admin.startsWith("✅") ? "text-success" : admin === "❌" ? "text-danger" : "text-info"}>{admin}</span>,
    staff: <span className={staff.startsWith("✅") ? "text-success" : staff === "❌" ? "text-danger" : "text-info"}>{staff}</span>,
  }));

  return (
    <Card title="Permission Matrix" icon="🔐">
      <Table columns={columns} rows={rows} />
    </Card>
  );
};

export default function RolesPermissions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">🔐 Roles & Permissions</h1>
        <p className="text-text-secondary">Overview of roles and their access levels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {roles.map(role => <RoleCard key={role.name} role={role} />)}
      </div>

      <MatrixTable />
    </div>
  );
}