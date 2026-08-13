import Card from "../../components/common/Card";

const CustomerLedger = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">📋 Customer Ledger</h1>
        <p className="text-text-secondary">Detailed receivable history with invoice and payment line items.</p>
      </div>
      <Card>
        <div className="h-64 rounded-xl border border-border bg-background flex items-center justify-center">
          <p className="text-text-muted">Customer Ledger - Coming Soon</p>
        </div>
      </Card>
    </div>
  );
};

export default CustomerLedger;