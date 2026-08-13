import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const ForgotPassword = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-1">Forgot password</h2>
      <p className="text-text-secondary mb-6">We will send a reset link to your registered email.</p>
      <form className="space-y-4">
        <Input label="Email" type="email" placeholder="admin@shop.com" />
        <Button variant="primary" className="w-full">Send reset link</Button>
      </form>
    </div>
  );
};

export default ForgotPassword;