import Card from "../../components/common/Card";

const ProductImportExport = () => {
  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-text">Product Import/Export</h2>
        <p className="text-sm text-text-muted">Bulk import or export inventory via Excel templates.</p>
      </header>
      <Card>
        <div className="h-64 rounded-xl border border-border bg-bg" />
      </Card>
    </div>
  );
};

export default ProductImportExport;