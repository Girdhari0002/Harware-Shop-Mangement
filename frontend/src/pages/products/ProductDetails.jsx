import Card from "../../components/common/Card";

const ProductDetails = () => {
  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-text">Product Details</h2>
        <p className="text-sm text-text-muted">View complete SKU dimensions, rates, taxes, and movement history.</p>
      </header>
      <Card>
        <div className="h-64 rounded-xl border border-border bg-bg" />
      </Card>
    </div>
  );
};

export default ProductDetails;