import Card from "../common/Card";

const InvoicePreview = () => {
  return (
    <Card title="GST Invoice Preview" subtitle="Print-friendly layout area">
      <div className="space-y-3 rounded-xl border border-border bg-white p-4">
        <div className="flex items-start justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-lg font-semibold text-text">Hardware & Plywood Shop</h3>
            <p className="text-xs text-text-muted">GSTIN: 29ABCDE1234F1Z5</p>
          </div>
          <div className="text-right text-xs tabular-nums text-text-muted">
            <p>Invoice: INV-0001</p>
            <p>Date: 13/07/2026</p>
          </div>
        </div>
        <div className="h-56 rounded-xl border border-border bg-bg" />
      </div>
    </Card>
  );
};

export default InvoicePreview;