import Table from "../common/Table";

const columns = [
  { key: "item", label: "Item" },
  { key: "qty", label: "Qty", numeric: true },
  { key: "rate", label: "Rate", numeric: true },
  { key: "amount", label: "Amount", numeric: true }
];

const rows = [{ id: 1, item: "Century Ply 19mm", qty: 2, rate: "₹2350", amount: "₹4700" }];

const InvoiceItemsTable = () => <Table columns={columns} rows={rows} />;

export default InvoiceItemsTable;