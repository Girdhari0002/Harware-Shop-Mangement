import Button from "../common/Button";

const InvoiceActions = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary">Download PDF</Button>
      <Button variant="outline">Print</Button>
      <Button variant="outline">Share WhatsApp</Button>
      <Button variant="outline">Share Email</Button>
    </div>
  );
};

export default InvoiceActions;