import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const ChangePassword = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-1">Change password</h2>
      <p className="text-text-secondary mb-6">Use a strong password for secure ERP access.</p>
      <form className="space-y-4">
        <Input label="Current password" type="password" />
        <Input label="New password" type="password" />
        <Input label="Confirm new password" type="password" />
        <Button variant="primary" className="w-full">Update password</Button>
      </form>
    </div>
  );
};

export default ChangePassword;