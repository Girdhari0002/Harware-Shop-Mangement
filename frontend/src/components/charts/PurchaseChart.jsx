import Card from "../common/Card";

const PurchaseChart = () => {
  return (
    <Card title="Purchase Chart" subtitle="Chart container for purchase data visualization">
      <div className="h-64 rounded-xl border border-border bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-text-muted">Purchase Chart - Connect your data</p>
        </div>
      </div>
    </Card>
  );
};

export default PurchaseChart;