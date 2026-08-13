import Card from "../../components/common/Card";

const SupplierLedger = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">📋 Supplier Ledger</h1>
        <p className="text-text-secondary">Detailed payable history with purchases and settlement entries.</p>
      </div>
      <Card>
        <div className="h-64 rounded-xl border border-border bg-background flex items-center justify-center">
          <p className="text-text-muted">Supplier Ledger - Coming Soon</p>
        </div>
      </Card>
    </div>
  );
};

export default SupplierLedger;