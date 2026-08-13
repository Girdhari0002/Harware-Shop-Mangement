import Button from "../common/Button";
import Input from "../common/Input";

const ExpenseForm = () => {
  return (
    <form className="erp-card space-y-4 p-4">
      <h3 className="text-lg font-semibold text-text">Expense Form</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Name" placeholder="Enter name" />
        <Input label="Code" placeholder="Enter code" />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Save</Button>
      </div>
    </form>
  );
};

export default ExpenseForm;