import Card from "../common/Card";

const SalesChart = () => {
  return (
    <Card title="Sales Chart" subtitle="Chart container for sales data visualization">
      <div className="h-64 rounded-xl border border-border bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">📈</div>
          <p className="text-text-muted">Sales Chart - Connect your data</p>
        </div>
      </div>
    </Card>
  );
};

export default SalesChart;