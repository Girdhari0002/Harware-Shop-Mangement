import Card from "../../components/common/Card";

const PurchaseInvoice = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">🧾 Purchase Invoice</h1>
        <p className="text-text-secondary">View purchase invoice with GST summary and item lines.</p>
      </div>
      <Card>
        <div className="h-64 rounded-xl border border-border bg-background flex items-center justify-center">
          <p className="text-text-muted">Purchase Invoice - Coming Soon</p>
        </div>
      </Card>
    </div>
  );
};

export default PurchaseInvoice;